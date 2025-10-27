import Device from '../models/Device.js';

export default async function markSeen(userId, fingerprint) {
    const device = await Device.findOneAndUpdate(
        { user: userId, fingerprint },
        { lastSeenAt: Date.now() },
        { new: true }
    );
    return device;
}


