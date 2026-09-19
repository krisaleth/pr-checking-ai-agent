import 'dotenv/config';

import { reviewPullRequest } from '../services/pr-review.service.js';


const owner = 'krisaleth';
const repo = 'test-bot-repo';
const pullNumber = 2;
const installationId = '162980399';


try {
    const review = await reviewPullRequest({
        owner,
        repo,
        pullNumber,
        installationId,
    });

    console.log('\n===== AI REVIEW =====\n');
    console.log(review);

} catch (error) {
    console.error('\n===== REVIEW ERROR =====\n');
    console.error(error);
    process.exit(1);
}