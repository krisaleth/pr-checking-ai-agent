const express = require("express");

const router = express.Router();

const {
    login,
    getProfile,
    refreshAccessToken,
    githubCallback
} = require("../controllers/auth.controller");

const verifyAccessToken = require("../middleware/auth.middleware");

// ==================== LOGIN ====================

// Login thường
router.post("/login", login);

// GitHub Login
router.get("/github", (req, res) => {
    const githubUrl =
        `https://github.com/login/oauth/authorize` +
        `?client_id=${process.env.GITHUB_CLIENT_ID}` +
        `&redirect_uri=${process.env.GITHUB_CALLBACK_URL}` +
        `&scope=user:email`;

    res.redirect(githubUrl);
});

// GitHub OAuth Callback
router.get("/github/callback", githubCallback);


// ==================== TOKEN ====================

// Lấy Access Token mới
router.post("/refresh-token", refreshAccessToken);


// ==================== PROTECTED API ====================

// API cần Access Token
router.get("/profile", verifyAccessToken, getProfile);


module.exports = router;