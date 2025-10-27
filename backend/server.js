import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './src/routes/auth.js';
import transactionRoutes from './src/routes/transaction.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://honorekimenyi_db_user:honorekimenyi_db_user@cluster0.owykcot.mongodb.net/user-client-db?retryWrites=true&w=majority';

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// Health check
app.get('/', (req, res) => res.json({ ok: true }));

// Global error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});

// Connect to MongoDB and start server
async function startServer() {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');

        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server', err);
        process.exit(1);
    }
}

startServer();
