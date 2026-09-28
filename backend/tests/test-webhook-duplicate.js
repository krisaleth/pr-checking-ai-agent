import 'dotenv/config';
import crypto from 'crypto';

const WEBHOOK_URL = process.env.TEST_WEBHOOK_URL;
const WEBHOOK_SECRET = process.env.GITHUB_APP_WEBHOOK_SECRET;

if (!WEBHOOK_URL) {
    throw new Error('TEST_WEBHOOK_URL is required');
}

if (!WEBHOOK_SECRET) {
    throw new Error('GITHUB_APP_WEBHOOK_SECRET is required');
}

const deliveryId = crypto.randomUUID();

const payload = {
    action: 'synchronize',
    number: 2,

    repository: {
        id: 1357804915,
        name: 'test-bot-repo',
        full_name: 'krisaleth/test-bot-repo',
        owner: {
            login: 'krisaleth',
        },
    },

    pull_request: {
        number: 2,
        title: 'Test duplicate review',
        user: {
            id: 123456,
        },
        state: 'open',

        head: {
            sha: '5d45c841a4e44a9a964848fc3a5550605a2b3235',
        },

        base: {
            sha: 'test-base-sha',
        },
    },

    installation: {
        id: 162980399,
    },
};

const rawBody = JSON.stringify(payload);

const signature =
    'sha256=' +
    crypto
        .createHmac('sha256', WEBHOOK_SECRET)
        .update(rawBody)
        .digest('hex');

console.log('Delivery ID:', deliveryId);
console.log(
    'Head SHA:',
    payload.pull_request.head.sha
);

const response = await fetch(WEBHOOK_URL, {
    method: 'POST',

    headers: {
        'Content-Type': 'application/json',
        'X-GitHub-Event': 'pull_request',
        'X-GitHub-Delivery': deliveryId,
        'X-Hub-Signature-256': signature,
        'User-Agent': 'GitHub-Hookshot/test',
    },

    body: rawBody,
});

console.log('HTTP:', response.status);
console.log(
    'Response:',
    await response.text()
);