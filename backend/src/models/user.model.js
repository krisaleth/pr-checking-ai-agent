import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true
        },

        username: {
            type: String,
            required: true
        },

        email: {
            type: String,
            default: null
        },

        avatar: {
            type: String,
            default: null
        },

        provider: {
            type: String,
            required: true,
            default: "github"
        },

        githubId: {
            type: String,
            required: true,
            unique: true
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

export default User;