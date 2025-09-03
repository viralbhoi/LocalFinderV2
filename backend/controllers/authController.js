import bcrypt from "bcrypt";
import { User } from "../models/User/user.models.js";
import { Customer } from "../models/Customer/customer.models.js";
import { Admin } from "../models/Admin/admin.models.js";
import { Seller } from "../models/Seller/seller.models.js";

export const signup = async (req, res) => {
    try {
        const { role, ...userData } = req.body;

        const existingUser = await User.find({ email: userData.email });

        if (existingUser) {
            return res
                .status(400)
                .json({ success: false, message: "Email already registered" });
        }

        const user = await User.create(userData);

        if (role === "Customer") {
            await Customer.create({
                userId: user._id,
                ...req.body.customerData,
            });
        } else if (role === "Admin") {
            await Admin.create({ userId: user._id, ...req.body.adminData });
        } else if (role === "Seller") {
            await Seller.create({ userId: user._id, ...req.body.sellerData });
        }

        res.status(201).json({
            success: true,
            message: "User registered",
            userId: user._id,
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user)
            return res
                .status(404)
                .json({ success: false, message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res
                .status(401)
                .json({ success: false, message: "Invalid credentials" });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.json({ success: true, accessToken, refreshToken, role: user.role });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
