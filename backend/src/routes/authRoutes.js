import { Router } from 'express';
import registerHandler from '../controllers/register.js';
import loginHandler from '../controllers/login.js';

const router = Router();

router.get('/',(req,res) => {
    res.status(200).json({ 
        message: "AlgoU Auth Server is running!",
        status: "healthy",
        timestamp: new Date().toISOString()
    });
});

router.post('/register', registerHandler);
router.post('/login', loginHandler);

export default router;