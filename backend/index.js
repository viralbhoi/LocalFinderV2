import mongoose from "mongoose";

connectToDB()
    .then(() => {
        console.log("Mongo Connected Successfully");
    })
    .catch((err) => {
        console.log(err);
    })

async function connectToDB() {
    await mongoose.connect("mongodb://127.0.0.1:27017/test");
}