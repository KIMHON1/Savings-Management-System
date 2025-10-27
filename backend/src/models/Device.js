import mongoose from 'mongoose';
const { Schema } = mongoose;

const deviceSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fingerprint: { type: String, required: true }, // e.g., user-agent + IP hash or custom token
    verified: { type: Boolean, default: false },
    verificationCode: { type: String }, // store code to verify device
    lastSeenAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Ensure uniqueness per user + fingerprint
deviceSchema.index({ user: 1, fingerprint: 1 }, { unique: true });

const Device = mongoose.model('Device', deviceSchema);

export default Device;
