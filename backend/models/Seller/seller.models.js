import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        gstNo: {
            type: String,
            required: true,
            unique: true,
        },
        address: {
            addressLine1: {
                type: String,
                required: true,
            },
            addressLine2: {
                type: String,
            },
            district: {
                type: String,
                required: true,
            },
            village: {
                type: String,
                required: true,
            },
            pincode: {
                type: String,
                required: true,
                match: /^[0-9]{6}$/,
            },
            state: {
                type: String,
                required: true,
            },
        },
    },
    {
        timestamps: true,
    }
);

export const Seller = mongoose.model("Seller", sellerSchema);
