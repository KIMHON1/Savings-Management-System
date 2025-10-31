import  transactionService  from '../services/transaction.js';

export async function deposit(req, res) {
    try {
        const userId = req.user.id;

        const { amount, note } = req.validated;
        const result = await transactionService.createDeposit({ userId, amount, note });
        return res.status(201).json(result);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
}
export async function confirmDeposit(req, res) {
    try {
        const { txId } = req.params;
        const result = await transactionService.confirmDeposit({ txId });
        return res.json(result);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
}

export async function withdraw(req, res) {
    try {
        const userId = req.user.id;
        const { amount, note } = req.validated;
        const result = await transactionService.withdraw({ userId, amount, note });
        return res.json(result);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
}
export async function history(req, res) {
    try {
        const userId = req.user.id;
        const transactions = await transactionService.getTransactions(userId);
        return res.json({ transactions });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
}
export async function getBalance(req, res) {
    try {
        const userId = req.user.id;
        const balance = await transactionService.getBalance(userId);
        return res.json({ balance });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
}

