import 'dotenv/config';

import {
    connectDatabase,
    disconnectDatabase,
} from '../config/database.js';

import Repository from '../models/repository.model.js';
import PullRequest from '../models/pull-request.model.js';
import Review from '../models/review.model.js';
import ReviewFinding from '../models/review-finding.model.js';

const TEST_REPO_ID = 999999999;

try {
    console.log('\n===== DATABASE TEST =====\n');

    await connectDatabase();

    console.log('[1] Creating Repository...');

    const repository = await Repository.findOneAndUpdate(
        {
            githubRepoId: TEST_REPO_ID,
        },
        {
            githubRepoId: TEST_REPO_ID,
            owner: 'krisaleth',
            name: 'test-bot-repo',
            fullName: 'krisaleth/test-bot-repo',
            installationId: '162980399',
        },
        {
            new: true,
            upsert: true,
        }
    );

    console.log('[Repository]', repository._id);


    console.log('\n[2] Creating Pull Request...');

    const pullRequest = await PullRequest.findOneAndUpdate(
        {
            repositoryId: repository._id,
            githubPrNumber: 999,
        },
        {
            repositoryId: repository._id,
            githubPrNumber: 999,
            title: 'Database test PR',
            authorGithubId: 123456,
            headSha: 'test-head-sha-123',
            baseSha: 'test-base-sha-123',
            state: 'open',
        },
        {
            new: true,
            upsert: true,
        }
    );

    console.log('[PullRequest]', pullRequest._id);


    console.log('\n[3] Creating Review...');

    const review = await Review.findOneAndUpdate(
        {
            pullRequestId: pullRequest._id,
            headSha: 'test-head-sha-123',
        },
        {
            pullRequestId: pullRequest._id,
            headSha: 'test-head-sha-123',
            status: 'completed',
            model: 'test-model',
            summary: 'Database test review',
            findingsCount: 1,
            mappedFindingsCount: 1,
            unmappedFindingsCount: 0,
            startedAt: new Date(),
            completedAt: new Date(),
        },
        {
            new: true,
            upsert: true,
        }
    );

    console.log('[Review]', review._id);


    console.log('\n[4] Creating Review Finding...');

    const finding = await ReviewFinding.create({
        reviewId: review._id,

        file: 'server.js',

        line: 5,

        side: 'RIGHT',

        severity: 'minor',

        confidence: 0.95,

        title: 'Hardcoded port',

        explanation:
            'The server port is hardcoded instead of being configurable.',

        suggestedFix:
            'Move the port value to an environment variable.',

        needsFullFile: false,

        mapped: true,

        postedToGithub: true,

        githubCommentId: 123456789,
    });

    console.log('[ReviewFinding]', finding._id);


    console.log('\n===== DATABASE TEST RESULT =====\n');

    console.log('Repository: OK');
    console.log('PullRequest: OK');
    console.log('Review: OK');
    console.log('ReviewFinding: OK');

    console.log('\nDatabase test successful.\n');

    await disconnectDatabase();

} catch (error) {
    console.error('\n===== DATABASE ERROR =====\n');

    console.error(error);

    try {
        await disconnectDatabase();
    } catch {}

    process.exit(1);
}