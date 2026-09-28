import mongoose from 'mongoose';

const reviewFindingSchema = new mongoose.Schema(
    {
        reviewId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review',
            required: true,
            index: true,
        },

        file: {
            type: String,
            required: true,
        },

        line: {
            type: Number,
            default: null,
        },

        side: {
            type: String,
            enum: ['LEFT', 'RIGHT', null],
            default: 'RIGHT',
        },

        severity: {
            type: String,
            enum: [
                'critical',
                'major',
                'minor',
                'nit',
            ],
            required: true,
        },

        confidence: {
            type: Number,
            required: true,
            min: 0,
            max: 1,
        },

        title: {
            type: String,
            required: true,
        },

        explanation: {
            type: String,
            required: true,
        },

        suggestedFix: {
            type: String,
            default: null,
        },

        needsFullFile: {
            type: Boolean,
            default: false,
        },

        mapped: {
            type: Boolean,
            default: false,
            index: true,
        },

        postedToGithub: {
            type: Boolean,
            default: false,
            index: true,
        },

        githubCommentId: {
            type: Number,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model(
    'ReviewFinding',
    reviewFindingSchema
);