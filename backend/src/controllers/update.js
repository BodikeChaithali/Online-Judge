import AuthUser from '../models/authUser.js';
import bcrypt from 'bcryptjs';
import validator from 'validator';

const updateHandler = async (req, res) => {
    try {
        const {email, password, newEmail, newPassword} = req.body;
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
        if(!newEmail && !newPassword) {
            return res.status(400).json({message: "Provide at least one field to update"});
        }
        if(newEmail) {
            if(!validator.isEmail(newEmail)) {
                return res.status(400).json({message: "Invalid email format"});
            }
            
            if(newEmail === email) {
                return res.status(400).json({message: "New email must be different from the current email"});
            }
            const existingUser = await AuthUser.findOne({ email: newEmail });
            if(existingUser) {
                return res.status(400).json({message: "Email already exists"});
            }
            user.email = newEmail;
        }
        if(newPassword) {
            if (!validator.isStrongPassword(newPassword)) {
                return res.status(400).json({
                    message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one symbol"
                });
            }
            if(newPassword === password) {
                return res.status(400).json({message: "New password must be different from the current password"});
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
        }
        await user.save();

        res.status(200).json({message: "User updated successfully", user: { id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email}});
    }
    catch(err) {
        console.error("Error updating user", err);
        return res.status(500).json({message: "Internal server error"});
    }
 };

export default updateHandler;