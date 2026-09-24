import 'dotenv/config';

import { getInstallationToken } from './github-app.service.js';

const getAppHeaders = async (installationId) => {
    if (!installationId) {
        throw new Error('installationId is required');
    }

    const token = await getInstallationToken(installationId);

    return {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'PR-Review-AI-Agent',
        'X-GitHub-Api-Version': '2022-11-28',
    };
};

export const fetchPRFilesWithInstallation = async (
    owner,
    repo,
    pullNumber,
    installationId
) => {
    const url =
        `https://api.github.com/repos/${owner}/${repo}` +
        `/pulls/${pullNumber}/files`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                ...(await getAppHeaders(installationId)),
                Accept: 'application/vnd.github+json',
            },
        });

        if (!response.ok) {
            throw new Error(
                `GitHub API request failed with status ${response.status}`
            );
        }

        return await response.json();
    } catch (error) {
        throw new Error(
            `GitHub API Error: ${error.message}`
        );
    }
};

export const fetchPullRequestWithInstallation = async (
    owner,
    repo,
    pullNumber,
    installationId
) => {
    const url =
        `https://api.github.com/repos/${owner}/${repo}` +
        `/pulls/${pullNumber}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                ...(await getAppHeaders(installationId)),
                Accept: 'application/vnd.github+json',
            },
        });

        if (!response.ok) {
            throw new Error(
                `GitHub API request failed with status ${response.status}`
            );
        }

        return await response.json();
    } catch (error) {
        throw new Error(
            `GitHub API Error: ${error.message}`
        );
    }
};

export const postPullRequestCommentWithInstallation = async (
    owner,
    repo,
    pullNumber,
    comment,
    installationId
) => {
    const url =
        `https://api.github.com/repos/${owner}/${repo}` +
        `/issues/${pullNumber}/comments`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                ...(await getAppHeaders(installationId)),
                Accept: 'application/vnd.github+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                body: comment,
            }),
        });

        if (!response.ok) {
            throw new Error(
                `GitHub API request failed with status ` +
                `${response.status} - ${response.statusText}`
            );
        }

        return await response.json();
    } catch (error) {
        throw new Error(
            `GitHub API Error: ${error.message}`
        );
    }
};