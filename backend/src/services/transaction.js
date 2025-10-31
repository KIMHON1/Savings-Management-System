import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import alerts from '../utils/alerts.js';
import mongoose from 'mongoose';

const LOW_BALANCE_THRESHOLD = parseFloat(process.env.LOW_BALANCE_THRESHOLD || '100');

async function createDeposit({ userId, amount, note }) {
    const tx = await Transaction.create({
        user: userId,
        type: 'deposit',
        amount,
        note
    });

    // Update user balance immediately
    await User.findByIdAndUpdate(userId, { $inc: { balance: amount } });
    const user = await User.findById(userId);

    return { transaction: tx, balance: user.balance };
}

async function withdraw({ userId, amount, note }) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    if (user.balance < amount) throw new Error('Insufficient funds');

    const tx = await Transaction.create({
        user: userId,
        type: 'withdrawal',
        amount,
        note
    });

    user.balance -= amount;
    await user.save();

    alerts.emit('withdrawal', { userId: user._id.toString(), transaction: tx });

    if (user.balance < LOW_BALANCE_THRESHOLD) {
        alerts.emit('lowBalance', { userId: user._id.toString(), balance: user.balance });
    }

    return { transaction: tx, balance: user.balance };
}

async function getTransactions(userId, { limit = 50, skip = 0 } = {}) {
    return Transaction.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
}

async function getBalance(userId) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    return user.balance; // Use the stored balance directly
}

// Default export object
const transactionService = {
    createDeposit,
    withdraw,
    getTransactions,
    getBalance
};

export default transactionService;
