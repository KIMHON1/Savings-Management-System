import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import alerts from '../utils/alerts.js';

const LOW_BALANCE_THRESHOLD = parseFloat(process.env.LOW_BALANCE_THRESHOLD || '100');

async function createDeposit({ userId, amount, note, autoConfirm = false }) {
    const tx = await Transaction.create({
        user: userId,
        type: 'deposit',
        amount,
        confirmed: !!autoConfirm,
        note
    });

    if (autoConfirm) {
        await User.findByIdAndUpdate(userId, { $inc: { balance: amount }});
        const user = await User.findById(userId);
        alerts.emit('depositConfirmed', { userId: user._id.toString(), transaction: tx });
        return { transaction: tx, balance: user.balance };
    }

    return { transaction: tx };
}

async function confirmDeposit({ txId }) {
    const tx = await Transaction.findById(txId);
    if (!tx) throw new Error('Transaction not found');
    if (tx.type !== 'deposit') throw new Error('Not a deposit transaction');
    if (tx.confirmed) throw new Error('Already confirmed');

    tx.confirmed = true;
    await tx.save();

    const user = await User.findByIdAndUpdate(tx.user, { $inc: { balance: tx.amount }}, { new: true });
    alerts.emit('depositConfirmed', { userId: user._id.toString(), transaction: tx });

    if (user.balance < LOW_BALANCE_THRESHOLD) {
        alerts.emit('lowBalance', { userId: user._id.toString(), balance: user.balance });
    }

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
        confirmed: true,
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
    return Transaction.find({ user: userId }).sort({ createdAt: -1 }).skip(skip).limit(limit);
}

// ✅ Default export object
const transactionService = {
    createDeposit,
    confirmDeposit,
    withdraw,
    getTransactions
};

export default transactionService;
