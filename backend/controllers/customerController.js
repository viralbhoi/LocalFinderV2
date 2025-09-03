import { User } from "../models/User/user.models.js";
import { Customer } from "../models/Customer/customer.models.js";
import { Cart } from "../models/Cart/cart.models.js";
import { Order } from "../models/Order/oerder.models.js";

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
