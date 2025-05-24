import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectToDB from "./db/db.js";
import authRoutes from "./routes/auth.route.js";
import globalErrorHandler from "./middleware/error.middleware.js";


connectToDB();
const app = express();
app.use(express.json());
app.use(cors(
    {
        credentials: true,
        origin: "http://localhost:3000",
    }
));
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


app.get("/", (req, res) => {
    res.status(200).json({
        message: "Hello World",
    });
});

app.use("/api/auth", authRoutes);

app.use(globalErrorHandler);

export default app;
