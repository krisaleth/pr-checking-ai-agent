import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true},
}, { timestamps: true });

refreshTokenSchema.index({ expiresAt: 1 }, { expiresAfterSecond: 0 });
refreshTokenSchema.index({ token: 1 },{ unique: true });

export default mongoose.model('RefreshToken', refreshTokenSchema)