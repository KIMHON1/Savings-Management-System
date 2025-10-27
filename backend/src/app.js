// config/db.js
import mongoose from 'mongoose';

export async function connectDB(uri) {
    try {
        // Mongoose connection options
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDB connected');

        // Optional: debug/log connection events
        mongoose.connection.on('connected', () => console.log('Mongoose connected'));
        mongoose.connection.on('error', (err) => console.error('Mongoose connection error:', err));
        mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'));

    } catch (err) {
        console.error('MongoDB connection failed', err);
        throw err; // re-throw to handle in server.js
    }
}
