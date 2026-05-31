import AuthUser from '../models/authUser.js';
import bcrypt from 'bcryptjs';
import validator from 'validator';

const registerHandler = async (req, res) => {
    try {
        const {firstName, lastName, email, password} = req.body;
        if(!firstName || !lastName || !email || !password) {
            return res.status(400).json({message: "All fields are required"});
        }
        if(!validator.isEmail(email)) {
            return res.status(400).json({message: "Invalid email format"});
        }
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one symbol"
            });
        }
        const existingUser = await AuthUser.findOne({ email });
        if(existingUser) {
            return res.status(400).json({message: "Email already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new AuthUser({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        await user.save();
        res.status(201).json({message: 'User registered successfully', user: { id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email}});
    }
    catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export default registerHandler;