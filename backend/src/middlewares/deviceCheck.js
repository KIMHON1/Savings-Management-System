import deviceService from '../services/device.js';
export default async function deviceCheck(req, res, next) {
    try {
        const fingerprint = req.headers['x-device-fingerprint'];
        if (req.user && fingerprint) {
            await deviceService.markSeen(req.user.id, fingerprint);
        }
    } catch (err) {
    }
    next();
}
