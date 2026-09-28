import AuthUser from '../models/authUser.js';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import jwt from "jsonwebtoken";

const isProduction = process.env.NODE_ENV === "production";

const registerHandler = async (req, res) => {
    try {
        const {firstName, lastName, email, password} = req.body;
        if(!firstName || !lastName || !email || !password) {
            return res.status(400).json({message: "All fields are required"});
        }
        const trimmedFirstName = firstName.trim();
        const trimmedLastName = lastName.trim();
        const trimmedEmail = email.trim();
        const nameRegex = /^[A-Za-z]+$/;
        if(!nameRegex.test(trimmedFirstName) || !nameRegex.test(trimmedLastName)) {
            return res.status(400).json({message: "First name and last name must contain only letters"});
        }
        if(!validator.isEmail(trimmedEmail)) {
            return res.status(400).json({message: "Invalid email format"});
        }
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one symbol"
            });
        }
        const existingUser = await AuthUser.findOne({ email: trimmedEmail });
        if(existingUser) {
            return res.status(400).json({message: "Email already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new AuthUser({
            firstName: trimmedFirstName,
            lastName: trimmedLastName,
            email: trimmedEmail,
            password: hashedPassword
        });

        await user.save();

        const token = jwt.sign({email: user.email,},process.env.JWT_SECRET,{expiresIn: "1d",},);

        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(201).json({message: 'User registered successfully', user: { id: user._id,
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