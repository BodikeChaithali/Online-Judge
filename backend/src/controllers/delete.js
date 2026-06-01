import AuthUser from '../models/authUser.js';
import bcrypt from 'bcryptjs';

const deleteHandler = async (req, res) => { 
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(400).json({message: "Email and password are required"});
        }
        const user = await AuthUser.findOne({ email });
        if(!user) {
            return res.status(401).json({message: "Invalid email or password"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(401).json({message: "Invalid email or password"});
        }
        await user.deleteOne();
        return res.status(200).json({
            message: "User deleted successfully",
            deletedUser: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
    } catch (err) {
        console.error("Error deleting user", err);
        return res.status(500).json({message: "Internal server error"});
    }
};

export default deleteHandler;