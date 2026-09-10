import { Router } from 'express';
import { login, getProfile, refreshAccessToken, githubCallback } from '../controllers/auth.controller.js';
import verifyAccessToken from '../middleware/auth.middleware.js';

const authRouter = Router();

authRouter.post("/login", login);

authRouter.get("/github", (req, res) => {
    const githubUrl =
        `https://github.com/login/oauth/authorize` +
        `?client_id=${process.env.GITHUB_CLIENT_ID}` +
        `&redirect_uri=${process.env.GITHUB_CALLBACK_URL}` +
        `&scope=user:email`;

    res.redirect(githubUrl);
});

authRouter.get("/github/callback", githubCallback);
authRouter.post("/refresh-token", refreshAccessToken);
authRouter.get("/profile", verifyAccessToken, getProfile);

export default authRouter;