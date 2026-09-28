import 'dotenv/config';

import {
    reviewPullRequest,
} from '../src/services/pr-review.service.js';

import {
    fetchPullRequestWithInstallation,
} from '../src/services/github.service.js';

import {
    createPullRequestReview,
} from '../src/services/github-review.service.js';


const owner = 'krisaleth';
const repo = 'test-bot-repo';
const pullNumber = 2;
const installationId = '162980399';


try {
    console.log('\n===== RUNNING AI REVIEW =====\n');

    const review = await reviewPullRequest({
        owner,
        repo,
        pullNumber,
        installationId,
    });

    console.log('\n===== REVIEW RESULT =====\n');

    console.dir(review, {
        depth: null,
    });


    if (review.findings.length === 0) {
        console.log(
            '\n[GitHub Review] No mapped findings. Nothing to post.'
        );

        process.exit(0);
    }


    console.log(
        '\n===== FETCHING PULL REQUEST =====\n'
    );

    const pullRequest =
        await fetchPullRequestWithInstallation(
            owner,
            repo,
            pullNumber,
            installationId
        );

    const commitId =
        pullRequest.head.sha;

    console.log(
        `[GitHub Review] Head SHA: ${commitId}`
    );


    console.log(
        '\n===== CREATING GITHUB REVIEW =====\n'
    );

    const result =
        await createPullRequestReview({
            owner,
            repo,
            pullNumber,
            installationId,
            commitId,
            findings: review.findings,
        });


    console.log(
        '\n===== GITHUB REVIEW CREATED =====\n'
    );

    console.dir(result, {
        depth: null,
    });


} catch (error) {

    console.error(
        '\n===== GITHUB REVIEW ERROR =====\n'
    );

    console.error(error);

    process.exit(1);
}