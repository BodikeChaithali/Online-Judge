import AuthUser from '../models/authUser.js';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

const loginHandler = async (req, res) => {
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
    
    const token = jwt.sign(
        {
        email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );
    res.status(200).json({
        message: "Login successful", 
        token: token, 
        user: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        }
    });
}

export default loginHandler;