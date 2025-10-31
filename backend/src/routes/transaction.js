import express from 'express';
import * as transController from '../controllers/transactionController.js';
import auth from '../middlewares/auth.js';
import deviceCheck from '../middlewares/deviceCheck.js';
import validate from '../utils/validators.js';
import { depositSchema, withdrawSchema } from '../dtos/transaction.js';

const router = express.Router();

router.use(auth);
router.use(deviceCheck);

// Routes
router.get('/history', transController.history);
router.post('/deposit', validate(depositSchema), transController.deposit);
router.post('/deposit/:txId/confirm', transController.confirmDeposit);
router.post('/withdraw', validate(withdrawSchema), transController.withdraw);
router.get('/balance', transController.getBalance);

export default router;
