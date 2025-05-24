import express from "express";
import { body } from "express-validator";
import { registerUser } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    body("fullname").isLength({ min: 3 }).withMessage("Fullname must be at least 3 characters long"),
], registerUser);


// router.post("/login", [
//     body("email").isEmail().withMessage("Please enter a valid email"),
//     body("password").isLength({min: 6}).withMessage("Password must be at least 6 characters long"),
// ], loginUser);

// router.post("/logout", userLogout);


export default router;