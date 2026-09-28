import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createAppAuth } from '@octokit/auth-app';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appId = process.env.GITHUB_APP_ID;

const privateKeyPath = path.resolve(
  __dirname,
  '../..',
  process.env.GITHUB_APP_PRIVATE_KEY_PATH
);

const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

const auth = createAppAuth({
  appId,
  privateKey,
});

export async function getInstallationToken(installationId) {
  const authentication = await auth({
    type: 'installation',
    installationId,
  });

  return authentication.token;
}

export async function getUserInstallation(username) {
    if (!username) {
        throw new Error('username is required');
    }

    const authentication = await auth({
        type: 'app',
    });

    const response = await fetch(
        `https://api.github.com/users/${encodeURIComponent(username)}/installation`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${authentication.token}`,
                Accept: 'application/vnd.github+json',
                'User-Agent': 'PR-Review-AI-Agent',
                'X-GitHub-Api-Version': '2022-11-28',
            },
        }
    );

    if (!response.ok) {
        if (response.status === 404) {
            return null;
        }

        throw new Error(
            `GitHub API request failed with status ${response.status}`
        );
    }

    return await response.json();
}

export async function getInstallation(installationId) {
    if (!installationId) {
        throw new Error('installationId is required');
    }

    const authentication = await auth({
        type: 'app',
    });

    const response = await fetch(
        `https://api.github.com/app/installations/${encodeURIComponent(
            installationId
        )}`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${authentication.token}`,
                Accept: 'application/vnd.github+json',
                'User-Agent': 'PR-Review-AI-Agent',
                'X-GitHub-Api-Version': '2022-11-28',
            },
        }
    );

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error(
            `GitHub API request failed with status ${response.status}`
        );
    }

    return await response.json();
}