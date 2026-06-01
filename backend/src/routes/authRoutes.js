import { Router } from 'express';
import registerHandler from '../controllers/register.js';
import loginHandler from '../controllers/login.js';
import updateHandler from '../controllers/update.js';
import deleteHandler from '../controllers/delete.js';

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
router.put('/update', updateHandler);
router.delete('/delete', deleteHandler);

export default router;