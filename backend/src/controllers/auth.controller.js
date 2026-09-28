import crypto from 'crypto';
import axios from 'axios';
import { User, OAuthToken, RefreshToken } from '../models/index.models.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/token.js';
import { decrypt, encrypt } from '../utils/encrypt.js';

const GITHUB_CLIENT_ID     = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const REDIRECT_URI         = process.env.REDIRECT_URI;
const REFRESH_TOKEN_TTL    = 30 * 24 * 3600 * 1000;

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export const authController = {
  redirectToGithub(req, res) {
    const state = crypto.randomBytes(16).toString('hex');
    req.session.oauthState = state;

    const url = new URL('https://github.com/login/oauth/authorize');
    url.searchParams.set('client_id', GITHUB_CLIENT_ID);
    url.searchParams.set('redirect_uri', REDIRECT_URI);
    url.searchParams.set('scope', 'repo read:user user:email');
    url.searchParams.set('state', state);

    res.redirect(url.toString());
  },
  async githubCallback(req, res) {
    try {
      const { code, state } = req.query;

      if (state !== req.session.oauthState) {
        return res.status(403).json({ error: 'Invalid state' });
      }
      delete req.session.oauthState;

      const tokenRes = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code,
        },
        { headers: { Accept: 'application/json' } }
      );

      const { access_token: githubToken, scope } = tokenRes.data;

      const userRes = await axios.get('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${githubToken}` },
      });
      const profile = userRes.data;

      let user = await User.findOne({ githubId: profile.id });
      if (!user) {
        user = await User.create({
          githubId:  profile.id,
          login:     profile.login,
          name:      profile.name,
          email:     profile.email,
          avatarUrl: profile.avatar_url,
        });
      } else {
        user.lastLoginAt = new Date();
        await user.save();
      }

      await OAuthToken.updateOne(
        { userId: user._id, provider: 'github' },
        {
          accessToken: encrypt(githubToken),
          scopes: (scope || '').split(' ').filter(Boolean),
        },
        { upsert: true }
      );

      const accessToken  = generateAccessToken(user._id);
      let refreshToken;
      const existing = await RefreshToken.findOne({
        userId: user._id,
        expiresAt: { $gt: new Date() }
      });
      if (existing) {
        refreshToken = decrypt(existing.rawToken);
      } else {
        await RefreshToken.deleteMany({ userId: user._id });
        refreshToken = generateRefreshToken(user._id);
        await RefreshToken.create({
          userId: user._id,
          token: hashToken(refreshToken),
          rawToken: encrypt(refreshToken),
          expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
        });
      }
      
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: REFRESH_TOKEN_TTL,
        path: '/'
      });

      res.json({ accessToken });
    } catch (err) {
      console.error('GitHub callback error:', err);
      res.status(500).json({ error: 'Login failed' });
    }
  },

  async logout(req, res) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (refreshToken) {
        await RefreshToken.deleteOne({ token: hashToken(refreshToken) });
      };
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      });   
      res.json({ message: 'Logged out' });
    } catch (err) {
      console.error('Logout error:', err);
      res.status(500).json({ error: 'Logout failed' });
    }
  },

  async logoutAll(req, res) {
    try {
      await RefreshToken.deleteMany({ userId: req.userId });
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      });
      res.json({ message: 'All sessions logged out' });
    } catch (err) {
      console.error('Logout all error:', err);
      res.status(500).json({ error: 'Logout failed' });
    }
  },
};   