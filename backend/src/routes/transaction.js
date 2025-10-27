import express from 'express';
import * as transController from '../controllers/transactionController.js';
import auth from '../middlewares/auth.js';
import deviceCheck from '../middlewares/deviceCheck.js';
import validate from '../utils/validators.js';
import { depositSchema, withdrawSchema } from '../dtos/transaction.js';

const router = express.Router(); // <-- define router

// Apply middlewares
router.use(auth);
router.use(deviceCheck); // optional to mark device usage

// Routes
router.get('/history', transController.history);
router.post('/deposit', validate(depositSchema), transController.deposit);
router.post('/deposit/:txId/confirm', transController.confirmDeposit);
router.post('/withdraw', validate(withdrawSchema), transController.withdraw);

// ES module export
export default router;
