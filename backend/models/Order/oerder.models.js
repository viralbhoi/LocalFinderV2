import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },
        products: [
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
                priceAtPurchase: {
                    type: Number,
                    required: true,
                }
            },
        ],
        paymentStatus: {
            type: String,
            enum: ["Pending", "Completed", "Rejected"],
            required: true,
            default: "Pending",
        },
        deliveryStatus: {
            type: String,
            enum: ["Pending", "Completed", "Cancelled"],
            required: true,
            default: "Pending",
        },
        totalAmount: {
            type: Number,
            required: true,
        },
        purchaseDate: {
            type: Date,
            required: true,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

export const Order = mongoose.model("Order", orderSchema);
