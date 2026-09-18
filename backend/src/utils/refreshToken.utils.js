import axios from "axios";

export async function refreshAccessToken(refreshToken) {
    const res = await axios.post('https://github.com/login/oauth/access_token',
        {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
        },
        {
            headers: { Accept: 'application/json' }
        }
    );

    const { access_token, refresh_token, expires_in } = res.data;

    return {
        accessToken: access_token,
        refreshToken: refresh_token,
        
    }
}