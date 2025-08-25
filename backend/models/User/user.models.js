import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        name: {
            firstName: {
                type: String,
                required: [true, "First name is required"],
                match: [
                    /^[A-Za-z]{2,}$/,
                    "Name must contain only letters and be at least 2 characters long",
                ],
            },
            lastName: {
                type: String,
                required: [true, "Last name is required"],
                match: [
                    /^[A-Za-z]{2,}$/,
                    "Name must contain only letters and be at least 2 characters long",
                ],
            },
        },
        dob: {
            type: Date,
            required: [true,"Must Enter Birth Date"],
        },
        email: {
            type: String,
            required: [true, "Must Enter Email !"],
            lowercase: true,
            unique: true,
            match: [
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                "Please fill a valid email address",
            ],
        },
        mobileNo: {
            type: String,
            required: true,
            unique: true,
            match: [/^[0-9]{10}$/, "Please Enter a valid mobile no without space and country code"],
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Others"],
            required: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
    },
    {
        timestamps: true,
        discriminatorKey: "role",
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

export const User = mongoose.model("User", userSchema);
