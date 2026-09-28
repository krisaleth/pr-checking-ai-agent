import mongoose from 'mongoose';

const webhookDeliverySchema = new mongoose.Schema(
    {
        githubDeliveryId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        event: {
            type: String,
            required: true,
        },

        action: {
            type: String,
            default: null,
        },

        repositoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Repository',
            default: null,
        },

        pullRequestNumber: {
            type: Number,
            default: null,
        },

        headSha: {
            type: String,
            default: null,
        },

        status: {
            type: String,
            enum: [
                'received',
                'processing',
                'processed',
                'failed',
                'ignored',
            ],
            default: 'received',
            index: true,
        },

        errorMessage: {
            type: String,
            default: null,
        },

        receivedAt: {
            type: Date,
            default: Date.now,
        },

        processedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model(
    'WebhookDelivery',
    webhookDeliverySchema
);