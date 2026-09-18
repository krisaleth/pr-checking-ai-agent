import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_SECRET
const REFRESH_SECRET = process.env.REFRESH_SECRET

export function generateAccessToken(userId) {
    return jwt.sign(
        {
            sub: userId
        },
        ACCESS_SECRET,
        {
            expiresIn: "15m"
        }
    );
};

export function generateRefreshToken(userId) {
    return jwt.sign(
        {
            userId: userId
        },
        REFRESH_SECRET,
        {
            expiresIn: "30d"
        }
    );
};

export function verifyAccessToken(token) {
    return jwt.verify(token, ACCESS_SECRET)
};

export function verifyRefreshToken(token) {
    return jwt.verify(token, REFRESH_SECRET)
};