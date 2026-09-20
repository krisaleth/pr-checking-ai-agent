import crypto from 'crypto';

const secret = process.env.GITHUB_APP_WEBHOOK_SECRET;

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
    title: 'Retry test',
    user: {
      id: 123456,
    },
    head: {
      sha: '5d45c841a4e44a9a964848fc3a5550605a2b3235',
    },
    base: {
      sha: 'test-base-sha',
    },
    state: 'open',
  },

  installation: {
    id: 162980399,
  },
};

const rawBody = JSON.stringify(payload);

const signature =
  'sha256=' +
  crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

const response = await fetch(
  'http://localhost:3000/api/github/webhooks',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-GitHub-Event': 'pull_request',
      'X-GitHub-Delivery': crypto.randomUUID(),
      'X-Hub-Signature-256': signature,
    },
    body: rawBody,
  }
);

console.log('Status:', response.status);
console.log('Response:', await response.text());