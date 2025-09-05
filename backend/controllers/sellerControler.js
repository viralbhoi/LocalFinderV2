import { Shop } from "../models/Shop/shop.models.js";
import { Seller } from "../models/Seller/seller.models.js";
import { Product } from "../models/Product/product.models.js";

export const addShop = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const { shopName, category, address } = req.body;

        const seller = await Seller.findById(sellerId);
        if (!seller) {
            return res
                .status(404)
                .json({ success: false, message: "Seller not found" });
        }

        const newShop = new Shop({
            sellerId,
            shopName,
            category,
            address,
        });

        await newShop.save();

        return res.status(200).json({
            success: true,
            message: "Shop added succesfully",
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const addProduct = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const {
            shopId,
            productName,
            productDescription,
            perUnitPrice,
            quantityPerUnit,
            qtyUnit,
            stock,
        } = req.body;

        const shop = await Shop.findOne({ _id: shopId, sellerId });
        if (!shop) {
            return res.status(404).json({
                success: false,
                message: "Shop not found or not owned by you",
            });
        }

        const newProduct = new Product({
            productName,
            productDescription,
            perUnitPrice,
            quantityPerUnit,
            qtyUnit,
            stock,
            shop: shopId,
        });

        await newProduct.save();

        return res.status(201).json({
            success: true,
            message: "Product added successfully",
            product: newProduct,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const updateStock = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const { shopId, productId, qty } = req.body;

        const shop = await Shop.findOne({ _id: shopId, sellerId });
        if (!shop) {
            return res.status(404).json({
                success: false,
                message: "Shop not found or not owned by you",
            });
        }

        const product = await Product.findOne({ _id: productId, shop: shopId });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product does not exist",
            });
        }

        if (product.stock + qty < 0) {
            return res.status(404).json({
                success: false,
                message: "Stock can not go negetive",
            });
        }

        product.stock += qty;
        await product.save();

        return res.status(200).json({
            success: true,
            message: "Stock updated successfully",
            product,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
