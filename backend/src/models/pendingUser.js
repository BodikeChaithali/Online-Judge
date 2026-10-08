import mongoose from "mongoose";

const pendingUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true }, 
  verificationHash: {
    type: String,
    required: true,
    unique: true,
    sparse: true,
  },
  otpHash: { type: String, required: true }, 
  otpExpiresAt: { type: Date, required: true },
  attempts: { type: Number, default: 0 },
  lastSentAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }, 
});

pendingUserSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("PendingUser", pendingUserSchema);
