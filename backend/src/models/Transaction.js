import mongoose from 'mongoose';
const { Schema } = mongoose;

const transactionSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['deposit', 'withdrawal'], required: true },
    amount: { type: Number, required: true },
    confirmed: { type: Boolean, default: false }, // deposit confirmation
    note: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Transaction', transactionSchema);
