import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        productName: {
            type: String,
            required: true,
        },
        productDescription: {
            type: String,
            required: true,
        },
        perUnitPrice: {
            type: Number,
            required: true,
        },
        quantityPerUnit: {
            type: Number,
            required: true,
        },
        qtyUnit: {
            type: String,
            enum: [
                "Kilogram",
                "Gram",
                "Liter",
                "Milliliter",
                "Meter",
                "Centimeter",
                "Nos",
            ],
            required: true,
        },
        stock: {
            type: Number,
            required: true,
        },
        shop: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Shop",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Product = mongoose.model("Product", productSchema);
