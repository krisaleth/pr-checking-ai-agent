import crypto from 'crypto';
import axios from 'axios';
import { User, OAuthToken, RefreshToken } from '../models/index.models.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/token.js';
import { encrypt } from '../utils/encrypt.js';

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
          client_id:     GITHUB_CLIENT_ID,
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
          scopes:      (scope || '').split(' ').filter(Boolean),
        },
        { upsert: true }
      );
      const accessToken  = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);
      await RefreshToken.create({
        userId:    user._id,
        token:     hashToken(refreshToken),
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
      });
      res.json({ accessToken, refreshToken });
    } catch (err) {
      console.error('GitHub callback error:', err);
      res.status(500).json({ error: 'Login failed' });
    }
  },
  async refresh(req, res) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ error: 'Missing refresh token' });
      }
      let payload;
      try {
        payload = verifyRefreshToken(refreshToken);
      } catch {
        return res.status(401).json({ error: 'Invalid or expired refresh token' });
      }
      const stored = await RefreshToken.findOne({
        token:  hashToken(refreshToken),
        userId: payload.sub,
      });

      if (!stored) {
        return res.status(401).json({ error: 'Token revoked' });
      }

      const newAccessToken = generateAccessToken(payload.sub);
      res.json({ accessToken: newAccessToken });
    } catch (err) {
      console.error('Refresh error:', err);
      res.status(500).json({ error: 'Refresh failed' });
    }
  },
  async logout(req, res) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ error: 'Missing refresh token' });
      }

      await RefreshToken.deleteOne({ token: hashToken(refreshToken) });
      res.json({ message: 'Logged out' });
    } catch (err) {
      console.error('Logout error:', err);
      res.status(500).json({ error: 'Logout failed' });
    }
  },
  async logoutAll(req, res) {
    try {
      await RefreshToken.deleteMany({ userId: req.userId });
      res.json({ message: 'All sessions logged out' });
    } catch (err) {
      console.error('Logout all error:', err);
      res.status(500).json({ error: 'Logout failed' });
    }
  },
};   