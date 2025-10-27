import User from '../models/User.js';
import Device from '../models/Device.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import alerts from '../utils/alerts.js';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export async function register({ email, password, name }) {
    const existing = await User.findOne({ email });
    if (existing) throw new Error('Email already registered');

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed, name });
    return user;
}

export async function login({ email, password, deviceFingerprint }) {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Invalid credentials');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error('Invalid credentials');

    let device;
    if (deviceFingerprint) {
        device = await Device.findOne({ user: user._id, fingerprint: deviceFingerprint });
        if (!device) {
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            device = await Device.create({
                user: user._id,
                fingerprint: deviceFingerprint,
                verified: false,
                verificationCode: code
            });
            alerts.emit('deviceVerificationCode', { userId: user._id.toString(), code, fingerprint: deviceFingerprint });
            return { requiresDeviceVerification: true, deviceId: device._id.toString() };
        } else if (!device.verified) {
            const code = device.verificationCode || Math.floor(100000 + Math.random() * 900000).toString();
            device.verificationCode = code;
            await device.save();
            alerts.emit('deviceVerificationCode', { userId: user._id.toString(), code, fingerprint: deviceFingerprint });
            return { requiresDeviceVerification: true, deviceId: device._id.toString() };
        }
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    alerts.emit('successfulLogin', { userId: user._id.toString(), fingerprint: deviceFingerprint || 'unknown' });

    return { token, user };
}

export async function confirmDevice({ deviceId, code }) {
    const device = await Device.findById(deviceId);
    if (!device) throw new Error('Device not found');
    if (device.verificationCode !== code) throw new Error('Invalid verification code');
    device.verified = true;
    device.verificationCode = null;
    device.lastSeenAt = Date.now();
    await device.save();
    return device;
}
