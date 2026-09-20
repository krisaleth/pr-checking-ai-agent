import 'dotenv/config';

import { connectDatabase } from '../src/config/database.js';
import Review from '../src/models/review.model.js';
import { processReview } from '../src/services/review-job.service.js';

const reviewId = '6aafe035f63cfbd8adb37f85';

await connectDatabase();

console.log('[Database] Connected');

try {
    const review = await Review.findById(reviewId);

    if (!review) {
        throw new Error(`Review not found: ${reviewId}`);
    }

    console.log('[Test] Before:', review.status);

    if (review.status !== 'failed') {
        throw new Error(
            `Expected failed status, got ${review.status}`
        );
    }

    review.status = 'queued';
    review.errorMessage = null;
    review.startedAt = null;
    review.completedAt = null;

    await review.save();

    console.log('[Test] Changed:', review.status);

    const result = await processReview(reviewId);

    console.log('===== RESULT =====');
    console.log({
        id: result._id.toString(),
        status: result.status,
        errorMessage: result.errorMessage,
        findingsCount: result.findingsCount,
        mappedFindingsCount: result.mappedFindingsCount,
        unmappedFindingsCount: result.unmappedFindingsCount,
    });
} catch (error) {
    console.error('===== ERROR =====');
    console.error(error);
}

process.exit(0);