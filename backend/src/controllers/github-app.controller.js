import crypto from 'crypto';

import User from '../models/user.model.js';
import GitHubInstallation from '../models/github-installation.model.js';
import { getInstallation } from '../services/github-app.service.js';

const GITHUB_APP_SLUG = 'pr-check-ai-agent';
const GITHUB_APP_STATE_TTL = 10 * 60 * 1000;

function createInstallState(userId) {
  const payload = {
    userId: userId.toString(),
    exp: Date.now() + GITHUB_APP_STATE_TTL,
    nonce: crypto.randomBytes(16).toString('hex'),
  };

  const encodedPayload = Buffer.from(
    JSON.stringify(payload)
  ).toString('base64url');

  const signature = crypto
    .createHmac('sha256', process.env.GITHUB_APP_STATE_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  return `${encodedPayload}.${signature}`;
}

function verifyInstallState(state) {
  if (!state) {
    throw new Error('Missing state');
  }

  const [encodedPayload, signature] = state.split('.');

  if (!encodedPayload || !signature) {
    throw new Error('Invalid state format');
  }

  const expectedSignature = crypto
    .createHmac('sha256', process.env.GITHUB_APP_STATE_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  const signaturesMatch = crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );

  if (!signaturesMatch) {
    throw new Error('Invalid state signature');
  }

  const payload = JSON.parse(
    Buffer.from(encodedPayload, 'base64url').toString('utf8')
  );

  if (!payload.userId) {
    throw new Error('Invalid state payload');
  }

  if (!payload.exp || Date.now() > payload.exp) {
    throw new Error('State expired');
  }

  return payload;
}

export const githubAppController = {
  install(req, res) {
    const state = createInstallState(req.userId);

    console.log('[GitHub App] Install:', {
      userId: req.userId,
    });

    const url = new URL(
      `https://github.com/apps/${GITHUB_APP_SLUG}/installations/new`
    );

    url.searchParams.set('state', state);

    return res.redirect(url.toString());
  },

  async setup(req, res) {
    try {
      const {
        installation_id: installationId,
        setup_action: setupAction,
        state,
      } = req.query;

      if (!installationId) {
        return res.status(400).json({
          error: 'Missing installation_id',
        });
      }

      if (!state) {
        return res.status(400).json({
          error: 'Missing state',
        });
      }

      const installState = verifyInstallState(state);

      const user = await User.findById(installState.userId);

      if (!user) {
        return res.status(401).json({
          error: 'User not found',
        });
      }

      const installation = await getInstallation(installationId);

      if (!installation) {
        return res.status(404).json({
          error: 'GitHub App installation not found',
        });
      }

      const existing = await GitHubInstallation.findOne({
        installationId: String(installation.id),
      });

      if (
        existing &&
        existing.userId.toString() !== user._id.toString()
      ) {
        return res.status(409).json({
          error: 'GitHub App installation is already linked to another user',
        });
      }

      const githubAccount = installation.account;

      const githubInstallation =
        await GitHubInstallation.findOneAndUpdate(
          {
            installationId: String(installation.id),
          },
          {
            userId: user._id,
            installationId: String(installation.id),
            accountId: githubAccount?.id ?? null,
            accountLogin: githubAccount?.login ?? null,
            accountType: githubAccount?.type ?? null,
          },
          {
            upsert: true,
            returnDocument: 'after',
          }
        );

      return res.status(200).json({
        message: 'GitHub App installed successfully',
        setupAction: setupAction || null,
        installation: {
          id: githubInstallation.installationId,
          accountId: githubInstallation.accountId,
          accountLogin: githubInstallation.accountLogin,
          accountType: githubInstallation.accountType,
        },
      });
    } catch (error) {
      console.error('[GitHub App] Setup failed:', error);

      return res.status(403).json({
        error: error.message || 'Failed to setup GitHub App',
      });
    }
  },
};