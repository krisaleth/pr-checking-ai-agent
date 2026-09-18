import { verifyAccessToken, generateAccessToken, verifyRefreshToken } from '../utils/token.js';
import { RefreshToken } from '../models/index.models.js';
import crypto from 'crypto';

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = header.split(' ')[1];
  try {
    const payload = verifyAccessToken(token);
    req.userId = payload.sub;
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      const refreshHeader = req.headers['x-refresh-token'];
      if (!refreshHeader) {
        return res.status(401).json({ error: 'Token expired, no refresh token provided' });
      }

      try {
        const payload = verifyRefreshToken(refreshHeader);
        const stored = await RefreshToken.findOne({
          token:  hashToken(refreshHeader),
          userId: payload.sub,
        });

        if (!stored) {
          return res.status(401).json({ error: 'Token revoked' });
        }

        const newAccessToken = generateAccessToken(payload.sub);
        req.userId = payload.sub;

        res.setHeader('X-Access-Token', newAccessToken);

        return next();
      } catch {
        return res.status(401).json({ error: 'Refresh token invalid' });
      }
    }

    return res.status(401).json({ error: 'Invalid token' });
  }
}   