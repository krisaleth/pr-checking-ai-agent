const refreshTokens = new Map();

export const saveRefreshToken = (userId, refreshToken) => {
    refreshTokens.set(userId, refreshToken);
};

export const getRefreshToken = (userId) => {
    return refreshTokens.get(userId);
};
