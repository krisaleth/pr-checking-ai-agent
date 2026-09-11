import jwt from "jsonwebtoken";

// Tạo Access Token - dùng để gọi API
export const generateAccessToken = (user) => {
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
export const generateRefreshToken = (user) => {
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
