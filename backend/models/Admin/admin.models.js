import mongoose from "mongoose";
import bcrypt from "bcrypt";

const adminSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        authKey: {
            type: String,
            maxlength: 10,
            minlength: 10,
        },
    },
    {
        timestamps: true,
    }
);

adminSchema.pre("save", async function (next) {
    if (!this.isModified("authKey")) return next();
    this.authKey = await bcrypt.hash(this.authKey, 10);
    next();
});

export const Admin = mongoose.model("Admin", adminSchema);
