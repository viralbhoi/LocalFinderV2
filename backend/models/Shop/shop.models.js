import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
    {
        sellerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Seller",
            required: true,
        },
        shopName: {
            type: String,
            required: true,
        },
        category: [
            {
                type: String,
            },
        ],
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

export const Shop = mongoose.model("Shop", shopSchema);
