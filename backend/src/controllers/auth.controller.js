import { validationResult } from "express-validator";
import userModel from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createUser, generateAccessAndRefreshTokens } from "../services/user.service.js";

const registerUser = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new ApiError(400, "Validation error", errors.array());
    }

    const { fullname, email, password } = req.body;

    const emailExist = await userModel.findOne({ email });
    if (emailExist) {
        throw new ApiError(409, "Email already exist");
    }

    const hashedPassword = await userModel.hashPassword(password);
    const user = await createUser({
        fullname,
        email,
        password: hashedPassword,
    });

    const createdUser = await userModel
        .findById(user._id)
        .select("-password -refreshTokens");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong registering user");
    }

    return res
        .status(201)
        .json(new ApiResponse(200, createdUser, "User registered successfully"));
});



const loginUser = asyncHandler (async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new ApiError(400, "Validation error", errors.array());
    }

    const {email, password} = req.body;

    if (!email || !password) {
        throw new ApiError(400, "All fields are required");
    }


    const user = await userModel.findOne({email});
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await userModel.comparePassword(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password");
    }

    const {accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await userModel.findById(user._id).select("-password -refreshTokens");

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "strict"
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged in successfully"
        )
    )


})

export { registerUser };
