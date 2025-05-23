import mongoose from "mongoose";

const connectToDB = async (retries = 5, delay = 2000) => {

    while (retries) {
        try {
            await mongoose.connect(process.env.MONGO_URI);
            console.log("Connected to DB");
            break;
        } catch (err) {
            console.error(`Retry to connect to DB in ${delay/ 1000}s....`, err);
            retries--;
            await new Promise((res) => setTimeout(res, delay));
        }
    }

    if  (!retries) {
        console.error("Could not connect to DB after multiple attempts");
        process.exit(1);
    }
}

export default connectToDB;