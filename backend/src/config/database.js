import mongoose from 'mongoose';
import 'dotenv/config';

export async function connectDatabase() {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        throw new Error(
            'MONGODB_URI is not set in environment variables'
        );
    }

    try {
        await mongoose.connect(uri);

        console.log(
            `[Database] Connected: ${mongoose.connection.name}`
        );
    } catch (error) {
        console.error(
            '[Database] Connection failed:',
            error.message
        );

        throw error;
    }
}

export async function disconnectDatabase() {
    await mongoose.disconnect();
    console.log('[Database] Disconnected');
}