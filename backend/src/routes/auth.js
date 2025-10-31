import express from 'express';
import * as authController from '../controllers/authController.js';
import validate from '../Utils/validators.js';
import { registerSchema, loginSchema } from '../dtos/auth.js';

const router = express.Router();
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/devices/confirm', authController.confirmDevice);
export default router;
