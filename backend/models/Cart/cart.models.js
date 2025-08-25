import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                qty: {
                    type: Number,
                    required: true,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

export const Cart = mongoose.model("Cart", cartSchema);
