import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

connectToDB()
    .then(() => {
        console.log("Mongo Connected Successfully");
    })
    .catch((err) => {
        console.log(err);
    });

async function connectToDB() {
    await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`);
}
