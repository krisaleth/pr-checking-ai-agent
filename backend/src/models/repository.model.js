import mongoose from 'mongoose';

const repositorySchema = new mongoose.Schema(
    {
        githubRepoId: {
            type: Number,
            required: true,
            unique: true,
            index: true,
        },

        owner: {
            type: String,
            required: true,
            trim: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        fullName: {
            type: String,
            required: true,
            trim: true,
        },

        installationId: {
            type: String,
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model(
    'Repository',
    repositorySchema
);