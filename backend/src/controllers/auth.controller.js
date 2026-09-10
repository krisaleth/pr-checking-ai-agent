const jwt = require("jsonwebtoken");

const axios = require("axios");

const {
    generateAccessToken,
    generateRefreshToken
} = require("/utils/token");

const {
    saveRefreshToken,
    getRefreshToken
} = require("../utils/refreshToken.store")

// Login và tạo 2 token
const login = (req, res) => {
    // Tạm thời giả lập user
    const user = {
        userId: "U001"
    };

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Lưu Refresh Token ở backend
    saveRefreshToken(user.userId, refreshToken);

    res.status(200).json({
        success: true,
        message: "Login successful",
        accessToken,
        refreshToken
    });
};

// API test cần đăng nhập
const getProfile = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Access Token is valid",
        user: req.user
    });
};

// Tạo Access Token mới bằng Refresh Token
const refreshAccessToken = (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh Token is required"
            });
        }

        // Kiểm tra Refresh Token có hợp lệ không
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        // Lấy Refresh Token đang được lưu ở backend
        const savedToken = getRefreshToken(decoded.userId);

        if (!savedToken || savedToken !== refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Invalid Refresh Token"
            });
        }

        // Tạo Access Token mới
        const newAccessToken = generateAccessToken({
            userId: decoded.userId
        });

        res.status(200).json({
            success: true,
            message: "Access Token refreshed",
            accessToken: newAccessToken
        });

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired Refresh Token"
        });
    }
};

// GitHub OAuth callback
const githubCallback = async (req, res) => {
    try {
        const { code } = req.query;

        if (!code) {
            return res.status(400).json({
                success: false,
                message: "GitHub authorization code is required"
            });
        }

        // Đổi code lấy GitHub Access Token
        const tokenResponse = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code: code
            },
            {
                headers: {
                    Accept: "application/json"
                }
            }
        );

        const githubAccessToken = tokenResponse.data.access_token;

        // Lấy thông tin tài khoản GitHub
        const userResponse = await axios.get(
            "https://api.github.com/user",
            {
                headers: {
                    Authorization: `Bearer ${githubAccessToken}`,
                    Accept: "application/vnd.github+json"
                }
            }
        );

        const githubUser = userResponse.data;

        // Tạm dùng GitHub ID làm userId
        const user = {
            userId: `github_${githubUser.id}`
        };

        // Tạo JWT của project
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Lưu Refresh Token ở backend
        saveRefreshToken(user.userId, refreshToken);

        res.status(200).json({
            success: true,
            message: "GitHub login successful",
            githubUser: {
                id: githubUser.id,
                login: githubUser.login,
                name: githubUser.name,
                avatar: githubUser.avatar_url
            },
            accessToken,
            refreshToken
        });

    } catch (error) {
        console.error(error.response?.data || error.message);

        return res.status(500).json({
            success: false,
            message: "GitHub login failed"
        });
    }
};

module.exports = {
    login,
    getProfile,
    refreshAccessToken,
    githubCallback
};