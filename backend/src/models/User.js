import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema(
    {
        email: { type: String, unique: true, required: true, lowercase: true },
        password: { type: String, required: true },
        name: { type: String },
        balance: { type: Number, default: 0 },
        isVerified: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

// Create the model
const User = mongoose.model('User', userSchema);

// Export the model
export default User;
