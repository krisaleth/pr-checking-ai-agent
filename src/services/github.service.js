import 'dotenv/config';

const getHeaders = () => {
    if (!process.env.GITHUB_TOKEN) {
        throw new Error('GITHUB_TOKEN is not set in environment variables');
    }
    return {
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
    };
};

export const fetchPRDiff = async (owner, repo, pullNumber) => {
    const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                ...getHeaders(),
                "Accept": "application/vnd.github.v3.diff",
                'User-Agent': 'PR-Review-AI-Agent',
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });

        if (!response.ok) {
            throw new Error(`GitHub API request failed with status ${response.status}`);
        }

        const diffText = await response.text();
        return diffText;
    } catch (error) {
        throw new Error(`GitHub API Error: ${error.message}`);
    }
}

export const postPullRequestComment = async (owner, repo, pullNumber, comment) => {
    const url = `https://api.github.com/repos/${owner}/${repo}/issues/${pullNumber}/comments`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                ...getHeaders(),
                "Accept": "application/vnd.github+json"
            },
            body: JSON.stringify({ body: comment })
        });
        if (!response.ok) {
            throw new Error(`GitHub API request failed with status ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(`GitHub API Error: ${error.message}`);
    }
}