import 'dotenv/config';
import { fetchPRDiffWithInstallation } from '../src/services/github.service.js';

const owner = 'krisaleth';
const repo = 'test-bot-repo';
const pullNumber = 2;
const installationId = 162980399;

try {
    const diff = await fetchPRDiffWithInstallation(
        owner,
        repo,
        pullNumber,
        installationId
    );

    console.log('GitHub App PR diff: SUCCESS');
    console.log('Diff length:', diff.length);
    console.log('\n--- DIFF PREVIEW ---\n');
    console.log(diff.slice(0, 2000));

    process.exit(0);
} catch (error) {
    console.error('GitHub App PR diff: FAILED');
    console.error(error.message);

    process.exit(1);
}