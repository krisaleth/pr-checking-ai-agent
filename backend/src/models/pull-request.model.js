import mongoose from 'mongoose';

const pullRequestSchema = new mongoose.Schema(
    {
        repositoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Repository',
            required: true,
            index: true,
        },

        githubPrNumber: {
            type: Number,
            required: true,
        },

        title: {
            type: String,
            default: '',
        },

        authorGithubId: {
            type: Number,
            default: null,
        },

        headSha: {
            type: String,
            required: true,
        },

        baseSha: {
            type: String,
            default: null,
        },

        state: {
            type: String,
            enum: ['open', 'closed'],
            default: 'open',
        },
    },
    {
        timestamps: true,
    }
);

pullRequestSchema.index(
    {
        repositoryId: 1,
        githubPrNumber: 1,
    },
    {
        unique: true,
    }
);

export default mongoose.model(
    'PullRequest',
    pullRequestSchema
);