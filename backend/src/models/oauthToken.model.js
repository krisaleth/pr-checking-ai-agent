import mongoose from 'mongoose'

const oauthTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    provider: {
        type: String,
        default: 'github',
    },
    accessToken: {
        type: String,
        required: true,
    },
    scopes: {
        type: [String],
        default: [],
    },
    expiresAt: {
        type: Date,
        required: true,
    }
}, { timestamps: true });

oauthTokenSchema.index({ expiresAt: 1}, {expireAfterSeconds: 0});

export default mongoose.model('OAuthToken', oauthTokenSchema);