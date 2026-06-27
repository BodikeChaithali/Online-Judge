import AuthUser from "../models/authUser.js";
import Draft from "../models/draftModel.js";
import Submission from "../models/submissionModel.js";
import ReviewLimit from "../models/reviewLimitModel.js";
import bcrypt from "bcryptjs";

const deleteHandler = async (req, res) => {
  try {
    const email = req.user.email;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    const user = await AuthUser.findOne({
      email,
    });

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

    await Draft.deleteMany({
      email,
    });

    await Submission.deleteMany({
      userEmail: email,
    });

    await ReviewLimit.deleteMany({
      userEmail: email,
    });

    await user.deleteOne();

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export default deleteHandler;