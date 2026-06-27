import AuthUser from "../models/authUser.js";
import bcrypt from "bcryptjs";
import validator from "validator";

const updateHandler = async (req, res) => {
  try {
    const email = req.user.email;
    const { password, newEmail, newPassword } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "Current password is required",
      });
    }

    const user = await AuthUser.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    if (!newEmail && !newPassword) {
      return res.status(400).json({
        message: "Provide at least one field to update",
      });
    }

    if (newEmail) {
      if (!validator.isEmail(newEmail)) {
        return res.status(400).json({
          message: "Invalid email format",
        });
      }

      if (newEmail === user.email) {
        return res.status(400).json({
          message: "New email must be different",
        });
      }

      const existingUser = await AuthUser.findOne({
        email: newEmail,
      });

      if (existingUser) {
        return res.status(400).json({
          message: "Email already exists",
        });
      }

      user.email = newEmail;
    }

    if (newPassword) {
      if (!validator.isStrongPassword(newPassword)) {
        return res.status(400).json({
          message:
            "Password must be at least 8 characters long and contain uppercase, lowercase, number and symbol",
        });
      }

      if (await bcrypt.compare(newPassword, user.password)) {
        return res.status(400).json({
          message: "New password must be different",
        });
      }

      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export default updateHandler;