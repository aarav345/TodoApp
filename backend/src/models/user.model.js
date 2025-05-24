import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const {JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } = process.env;

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            minlength: [3, "Email must be at least 3 characters long"],
        },

        fullname: {
            type: String,
            required: true,
            minlength: [3, "Fullname must be at least 3 characters long"],
        },

        password: {
            type: String,
            required: true,
            minlength: [6, "Password must be at least 6 characters long"],
            select: false,
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },

        refreshToken: {
            type: String
        }
    },
    { timestamps: true }
);


userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        { id: this._id, role: this.role },
        JWT_ACCESS_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
    );
}

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        { id: this._id, role: this.role },
        JWT_REFRESH_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
    );
}


userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}


userSchema.statics.hashRefreshToken = async (refreshToken) => {
    const salt = await bcrypt.genSalt(10);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
    return hashedRefreshToken;
}



const userModel = mongoose.model("User", userSchema);
export default userModel;