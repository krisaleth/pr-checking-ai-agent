import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
    {
        pullRequestId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PullRequest',
            required: true,
            index: true,
        },

        headSha: {
            type: String,
            required: true,
            index: true,
        },

        githubDeliveryId: {
            type: String,
            default: null,
            index: true,
        },

        status: {
            type: String,
            enum: [
                'queued',
                'running',
                'completed',
                'failed',
                'skipped',
            ],
            default: 'queued',
            index: true,
        },

        model: {
            type: String,
            default: null,
        },

        summary: {
            type: String,
            default: '',
        },

        rawAiResponse: {
            type: mongoose.Schema.Types.Mixed,
            default: null,
        },

        findingsCount: {
            type: Number,
            default: 0,
        },

        mappedFindingsCount: {
            type: Number,
            default: 0,
        },

        unmappedFindingsCount: {
            type: Number,
            default: 0,
        },

        githubReviewId: {
            type: Number,
            default: null,
        },

        errorMessage: {
            type: String,
            default: null,
        },

        startedAt: {
            type: Date,
            default: null,
        },

        completedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

reviewSchema.index(
    {
        pullRequestId: 1,
        headSha: 1,
    },
    {
        unique: true,
    }
);

export default mongoose.model(
    'Review',
    reviewSchema
);