import 'dotenv/config';

import { connectDatabase, disconnectDatabase } from '../src/config/database.js';
import Review from '../src/models/review.model.js';

const pullRequestId = '6aae8b48e8132fdb42b6973a';
const headSha = 'race-test-sha-20260920';

try {
    await connectDatabase();

    console.log('\n===== CLEANING TEST DATA =====\n');

    await Review.deleteMany({
        pullRequestId,
        headSha,
    });

    console.log('Test data cleaned.');

    console.log('\n===== STARTING RACE TEST =====\n');

    const createReview = async (name) => {
        try {
            console.log(`[${name}] Creating review...`);

            const review = await Review.create({
                pullRequestId,
                headSha,
                status: 'queued',
            });

            console.log(
                `[${name}] CREATED: ${review._id}`
            );

            return {
                name,
                created: true,
                reviewId: review._id.toString(),
            };
        } catch (error) {
            if (error?.code !== 11000) {
                throw error;
            }

            console.log(
                `[${name}] E11000 - Review already exists`
            );

            const existingReview = await Review.findOne({
                pullRequestId,
                headSha,
            });

            if (!existingReview) {
                throw new Error(
                    `[${name}] E11000 but existing review not found`
                );
            }

            console.log(
                `[${name}] LOADED: ${existingReview._id}`
            );

            return {
                name,
                created: false,
                reviewId: existingReview._id.toString(),
            };
        }
    };

    const results = await Promise.all([
        createReview('REQUEST-A'),
        createReview('REQUEST-B'),
    ]);

    console.log('\n===== RESULTS =====\n');

    console.dir(results, { depth: null });

    const reviews = await Review.find({
        pullRequestId,
        headSha,
    });

    console.log('\n===== DATABASE CHECK =====\n');

    console.log(
        'Review count:',
        reviews.length
    );

    for (const review of reviews) {
        console.log({
            id: review._id.toString(),
            pullRequestId: review.pullRequestId.toString(),
            headSha: review.headSha,
            status: review.status,
        });
    }

    if (reviews.length !== 1) {
        throw new Error(
            `Race test failed: expected 1 review, found ${reviews.length}`
        );
    }

    const reviewIds = results.map(
        (result) => result.reviewId
    );

    if (
        reviewIds[0] !== reviewIds[1] ||
        reviewIds[0] !== reviews[0]._id.toString()
    ) {
        throw new Error(
            'Race test failed: requests did not resolve to the same Review'
        );
    }

    console.log('\n===== RACE TEST PASSED =====\n');

} catch (error) {
    console.error(
        '\n===== RACE TEST FAILED =====\n'
    );

    console.error(error);

    process.exitCode = 1;

} finally {
    await disconnectDatabase();
}