import 'dotenv/config';

import { connectDatabase, disconnectDatabase } from './config/database.js';
import { processReview } from './services/review-job.service.js';

const reviewId = '6aae958fe8132fdb42b69740';

try {
    await connectDatabase();

    console.log('\n===== PROCESSING REVIEW =====\n');

    const review = await processReview(reviewId);

    console.log('\n===== REVIEW RESULT =====\n');
    console.dir(review, { depth: null });

} catch (error) {
    console.error('\n===== REVIEW JOB ERROR =====\n');
    console.error(error);

    process.exitCode = 1;

} finally {
    await disconnectDatabase();
}