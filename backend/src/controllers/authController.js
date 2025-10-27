import * as authService from '../services/auth.js';

export async function register(req, res) {
    try {
        const user = await authService.register(req.validated);
        return res.status(201).json({ user: { id: user._id, email: user.email, name: user.name }});
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
}

export async function login(req, res) {
    try {
        const payload = { ...req.validated };
        const result = await authService.login(payload);
        if (result.requiresDeviceVerification) {
            return res.status(200).json({ message: 'Device verification required', deviceId: result.deviceId });
        }
        return res.json({ token: result.token, user: { id: result.user._id, email: result.user.email, name: result.user.name }});
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
}

export async function confirmDevice(req, res) {
    try {
        const { deviceId, code } = req.body;
        const device = await authService.confirmDevice({ deviceId, code });
        return res.json({ message: 'Device verified', device: { id: device._id, fingerprint: device.fingerprint }});
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
}
