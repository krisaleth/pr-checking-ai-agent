import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        githubId: {
            type: Number,
            required: true,
            unique: true,
        },
        login: {
            type: String,
            maxlength: 39,
        },
        name: {
            type: String,
            maxlength: 255
        },
        email: {
            type: String,
        },
        avatarUrl: {
            type: String,
        },
        lastLoginAt: {
            type: Date,
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('User', userSchema);