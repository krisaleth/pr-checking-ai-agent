const jwt = require("jsonwebtoken");

// Tạo Access Token - dùng để gọi API
const generateAccessToken = (user) => {
    return jwt.sign(
        {
            userId: user.userId
        },
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn: "15m"
        }
    );
};

// Tạo Refresh Token - dùng để lấy Access Token mới
const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            userId: user.userId
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: "7d"
        }
    );
};

module.exports = {
    generateAccessToken,
    generateRefreshToken
};