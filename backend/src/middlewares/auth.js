import jwt from 'jsonwebtoken';
import User from '../models/User.js';
const JWT_SECRET = process.env.JWT_SECRET;
export default async function authMiddleware(req, res, next) {
    try {
        const header = req.headers.authorization;
        if (!header) {
            return res.status(401).json({ error: 'Missing authorization header' });
        }
        const token = header.split(' ')[1];
        const payload = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(payload.id);
        if (!user) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        req.user = { id: user._id, email: user.email, name: user.name };
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
}

