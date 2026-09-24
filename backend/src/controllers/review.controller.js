import Review from '../models/review.model.js';
import ReviewFinding from '../models/review-finding.model.js';
import Repository from '../models/repository.model.js';
import PullRequest from '../models/pull-request.model.js';
import mongoose from 'mongoose';

export const getReviewResult = async (req, res) => {
    try {
        const { reviewId } = req.params;

        if (!reviewId) {
            return res.status(400).json({
                error: 'reviewId is required',
            });
        }

        const review = await Review.findById(reviewId).lean();

        console.log('[Review API] review found:', !!review);

        if (!review) {
            return res.status(404).json({
                error: 'Review not found',
            });
        }

        const findings = await ReviewFinding
            .find({
                reviewId: review._id,
            })
            .select(
                'file line side severity confidence ' +
                'title explanation suggestedFix ' +
                'needsFullFile mapped postedToGithub ' +
                'githubCommentId'
            )
            .sort({
                file: 1,
                line: 1,
            })
            .lean();

        return res.status(200).json({
            id: review._id,
            pullRequestId: review.pullRequestId,
            headSha: review.headSha,

            status: review.status,

            model: review.model,
            summary: review.summary,

            counts: {
                total: review.findingsCount,
                mapped: review.mappedFindingsCount,
                unmapped: review.unmappedFindingsCount,
            },

            githubReviewId: review.githubReviewId,

            findings,

            errorMessage:
                review.status === 'failed'
                    ? review.errorMessage
                    : null,

            startedAt: review.startedAt,
            completedAt: review.completedAt,

            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
        });
    } catch (error) {
        console.error(
            '[Review API] Failed to get review:',
            error
        );

        return res.status(500).json({
            error: 'Failed to get review',
        });
    }
};

export const getReviewHistory = async (req, res) => {
    try {
        if (req.query.page !== undefined) {
            const parsedPage = Number.parseInt(req.query.page, 10);

            if (!Number.isInteger(parsedPage) || parsedPage <= 0) {
                return res.status(400).json({
                    error: 'Invalid page',
                });
            }
        }

        const page = Math.max(
            Number.parseInt(req.query.page, 10) || 1,
            1
        );

        if (req.query.limit !== undefined) {
            const parsedLimit = Number.parseInt(req.query.limit, 10);

            if (!Number.isInteger(parsedLimit) || parsedLimit <= 0 || parsedLimit > 100) {
                return res.status(400).json({
                    error: 'Invalid limit',
                });
            }
        }

        const limit = Math.min(
            Math.max(
                Number.parseInt(req.query.limit, 10) || 20,
                1
            ),
            100
        );

        const { repo } = req.query;
        const { pullNumber } = req.query;
        const { headSha } = req.query;
        const { state } = req.query;

        if (repo && typeof repo !== 'string') {
            return res.status(400).json({
                error: 'Invalid repo',
            });
        }

        if (pullNumber !== undefined) {
            const parsedPullNumber = Number.parseInt(pullNumber, 10);

            if (
                !Number.isInteger(parsedPullNumber) ||
                parsedPullNumber <= 0
            ) {
                return res.status(400).json({
                    error: 'Invalid pullNumber',
                });
            }
        }

        if (headSha !== undefined) {
            if (!/^[0-9a-fA-F]{40}$/.test(headSha)) {
                return res.status(400).json({
                    error: 'Invalid headSha',
                });
            }
        }

        if (state !== undefined && !['open', 'closed'].includes(state)) {
            return res.status(400).json({
                error: 'Invalid state',
            });
        }

        const allowedStatuses = [
            'queued',
            'running',
            'completed',
            'failed',
            'skipped',
        ];

        const { status } = req.query;

        const { pullRequestId } = req.query;

        if (
            pullRequestId &&
            !mongoose.Types.ObjectId.isValid(pullRequestId)
        ) {
            return res.status(400).json({
                error: 'Invalid pullRequestId',
            });
        }

        if (status && !allowedStatuses.includes(status)) {
            return res.status(400).json({
                error: 'Invalid status',
            });
        }

        const filter = {};

        if (status) {
            filter.status = status;
        }

        if (pullRequestId) {
            filter.pullRequestId = new mongoose.Types.ObjectId(
                pullRequestId
            );
        }

        if (repo || pullNumber !== undefined || state !== undefined) {
            const pullRequestFilter = {};

            if (repo) {
                const repository = await Repository.findOne({
                    fullName: repo,
                }).select('_id').lean();

                if (!repository) {
                    return res.status(200).json({
                        reviews: [],
                        pagination: {
                            page,
                            limit,
                            total: 0,
                            pages: 0,
                        },
                    });
                }

                pullRequestFilter.repositoryId = repository._id;
            }

            if (pullNumber !== undefined) {
                pullRequestFilter.githubPrNumber = Number.parseInt(pullNumber, 10);
            }

            if (state !== undefined) {
                pullRequestFilter.state = state;
            }

            const pullRequests = await PullRequest.find(
                pullRequestFilter
            ).select('_id').lean();

            filter.pullRequestId = {
                $in: pullRequests.map(
                    (pullRequest) => pullRequest._id
                ),
            };
        }

        if (headSha) {
            filter.headSha = headSha;
        }

        const skip = (page - 1) * limit;

        const [reviews, total] = await Promise.all([
            Review.find(filter)
                .select(
                    'pullRequestId headSha status model summary ' +
                    'findingsCount mappedFindingsCount ' +
                    'unmappedFindingsCount githubReviewId ' +
                    'errorMessage startedAt completedAt createdAt updatedAt'
                )
                .sort({
                    createdAt: -1,
                })
                .skip(skip)
                .limit(limit)
                .lean(),

            Review.countDocuments(filter),
        ]);

        return res.status(200).json({
            reviews: reviews.map((review) => ({
                id: review._id.toString(),
                pullRequestId: review.pullRequestId.toString(),
                headSha: review.headSha,

                status: review.status,

                model: review.model,
                summary: review.summary,

                counts: {
                    total: review.findingsCount,
                    mapped: review.mappedFindingsCount,
                    unmapped: review.unmappedFindingsCount,
                },

                githubReviewId: review.githubReviewId,

                errorMessage:
                    review.status === 'failed'
                        ? review.errorMessage
                        : null,

                startedAt: review.startedAt,
                completedAt: review.completedAt,

                createdAt: review.createdAt,
                updatedAt: review.updatedAt,
            })),

            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error(
            '[Review API] Failed to get review history:',
            error
        );

        return res.status(500).json({
            error: 'Failed to get review history',
        });
    }
};