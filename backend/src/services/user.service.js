import userModel from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

const createUser = async ({
    fullname, email, password
}) => {
    if (!fullname || !email || !password) {
        throw new Error("All fields are required");
    }   

    const user = await userModel.create({
        email,
        fullname,
        password
    })

    return user;
}


const generateAccessAndRefreshTokens = async (userID) => {
    try {
        const user = await userModel.findById(userID);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});

        return {accessToken, refreshToken};

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token");
    }
}

export {createUser, generateAccessAndRefreshTokens};