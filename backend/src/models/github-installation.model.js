import mongoose from 'mongoose';

const githubInstallationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },

        installationId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        accountId: {
            type: Number,
            default: null,
        },

        accountLogin: {
            type: String,
            default: null,
            trim: true,
        },

        accountType: {
            type: String,
            enum: ['User', 'Organization'],
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model(
    'GitHubInstallation',
    githubInstallationSchema
);