import { Router } from 'express';
import registerHandler from '../controllers/register.js';
import loginHandler from '../controllers/login.js';
import updateHandler from '../controllers/update.js';
import deleteHandler from '../controllers/delete.js';
import authMiddleware from "../middleware/authMiddleware.js";
import meHandler from "../controllers/meHandler.js";
import logoutHandler from "../controllers/logoutHandler.js";
import { verifyOtpHandler, resendOtpHandler } from "../controllers/verifyEmail.js";
import { registerLimiter, verifyLimiter, resendLimiter } from "../middleware/authRateLimiters.js";

const router = Router();

router.get('/',(req,res) => {
    res.status(200).json({ 
        message: "AlgoU Auth Server is running!",
        status: "healthy",
        timestamp: new Date().toISOString()
    });
});

router.post('/api/register', registerLimiter, registerHandler);
router.post('/api/verify-otp', verifyLimiter, verifyOtpHandler);
router.post('/api/resend-otp', resendLimiter, resendOtpHandler);
router.post('/api/login', loginHandler);
router.put('/api/update',authMiddleware, updateHandler);
router.delete('/api/delete',authMiddleware, deleteHandler);
router.get("/api/me", authMiddleware, meHandler);
router.post("/api/logout", authMiddleware, logoutHandler);

export default router;