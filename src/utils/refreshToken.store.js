// Lưu Refresh Token ở backend
const refreshTokens = new Map();

const saveRefreshToken = (userId, refreshToken) => {
    refreshTokens.set(userId, refreshToken);
};

const getRefreshToken = (userId) => {
    return refreshTokens.get(userId);
};

module.exports = {
    saveRefreshToken,
    getRefreshToken
};