const jwt = require("jsonwebtoken");

// Kiểm tra Access Token
const verifyAccessToken = (req, res, next) => {
    try {
        // Lấy token từ header Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access Token is required"
            });
        }

        // Lấy phần token sau "Bearer "
        const token = authHeader.split(" ")[1];

        // Kiểm tra token
        const decoded = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET
        );

        // Lưu thông tin user vào request
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired Access Token"
        });
    }
};

module.exports = verifyAccessToken;