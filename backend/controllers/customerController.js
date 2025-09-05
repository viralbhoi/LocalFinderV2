import { User } from "../models/User/user.models.js";
import { Customer } from "../models/Customer/customer.models.js";
import { Cart } from "../models/Cart/cart.models.js";
import { Order } from "../models/Order/oerder.models.js";
import { Product } from "../models/Product/product.models.js";
import mongoose from "mongoose";

export const updateCustomerProfile = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.id !== id) {
            return res.status(403).json({
                success: false,
                message: "You can only update your own profile",
            });
        }

        const { customerData, ...userData } = req.body;
        const user = await User.findByIdAndUpdate(id, userData, { new: true });

        if (customerData) {
            await Customer.findOneAndUpdate({ userId: id }, customerData, {
                new: true,
            });
        }

        res.json({
            success: true,
            message: "Profile updated successfully",
            user,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ userId }).populate("items.productId");
        res.json({ success: true, cart });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getPurchaseHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({ userId })
            .sort({ purchaseDate: -1 })
            .populate("products.productId");
        res.json({ success: true, orders });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, qty } = req.body;

        if (!qty || qty <= 0) {
            return res
                .status(400)
                .json({ success: false, message: "Quantity must be > 0" });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = await Cart.create({ userId, items: [{ productId, qty }] });
        } else {
            const itemIdx = cart.items.findIndex(
                (item) => item.productId.toString() === productId
            );

            if (itemIdx == -1) {
                cart.items.push({ productId, qty });
            } else {
                cart.items[itemIdx].qty += qty;
            }

            await cart.save();
        }

        return res.json({ success: true, message: "Item added to cart", cart });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const makePurchaseHistory = async (req, res) => {
    try {
        const userId = req.user.id;

        let cart = await Cart.findOne({ userId }).populate("items.productId");

        if (!cart || cart.items.length === 0) {
            return res
                .status(400)
                .json({ success: false, message: "Cart is empty!" });
        }

        let products = cart.items.map((item) => {
            return {
                productId: item.productId._id,
                qty: item.qty,
                priceAtPurchase: item.productId.perUnitPrice,
            };
        });

        const order = new Order({
            userId,
            products,
            totalAmount: products.reduce(
                (acc, p) => acc + p.qty * p.priceAtPurchase,
                0
            ),
        });
        await order.save();

        cart.items = [];
        await cart.save();

        return res.json({
            success: true,
            message: "Purchase Successful",
            order,
            cart,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
