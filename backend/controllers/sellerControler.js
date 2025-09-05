import { Shop } from "../models/Shop/shop.models.js";
import { Seller } from "../models/Seller/seller.models.js";
import { Product } from "../models/Product/product.models.js";
import { Order } from "../models/Order/oerder.models.js";

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

export const getShops = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const shops = await Shop.find({ sellerId });

        return res.status(200).json({
            success: true,
            message: "Shop fetched succesfully",
            shops,
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

export const updateProduct = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const { shopId, productId, perUnitPrice, quantityPerUnit, qty } =
            req.body;

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

        if (perUnitPrice <= 0) {
            return res.status(404).json({
                success: false,
                message: "Price must be positive",
            });
        }

        if (quantityPerUnit <= 0) {
            return res.status(404).json({
                success: false,
                message: "Price must be positive",
            });
        }

        product.stock += qty;
        product.quantityPerUnit = quantityPerUnit;
        product.perUnitPrice = perUnitPrice;
        await product.save();

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const { shopId, productId } = req.body;

        const shop = await Shop.findOne({ _id: shopId, sellerId });
        if (!shop) {
            return res.status(404).json({
                success: false,
                message: "Shop not found or not owned by you",
            });
        }

        const product = await Product.findOneAndDelete({
            _id: productId,
            shop: shopId,
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product does not exist or not owned by you",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product Deleted successfully",
            product,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const filterSellerOrders = (orders, sellerProductIds) => {
    return orders.map((order) => {
        const sellerProductsInOrder = order.products.filter((p) =>
            sellerProductIds.includes(p.productId._id.toString())
        );

        return {
            orderId: order._id,
            userId: order.userId,
            products: sellerProductsInOrder.map((p) => ({
                productId: p.productId._id,
                productName: p.productId.productName,
                qty: p.qty,
                priceAtPurchase: p.priceAtPurchase,
            })),
            totalAmount: sellerProductsInOrder.reduce(
                (acc, p) => acc + p.qty * p.priceAtPurchase,
                0
            ),
            purchaseDate: order.purchaseDate,
            paymentStatus: order.paymentStatus,
            deliveryStatus: order.deliveryStatus,
        };
    });
};

export const getAllOrders = async (req, res) => {
    try {
        const sellerId = req.user.id;

        const sellerShops = await Shop.find({ sellerId });
        const sellerShopIds = sellerShops.map((shop) => shop._id);

        const sellerProducts = await Product.find({
            shop: { $in: sellerShopIds },
        });
        const sellerProductIds = sellerProducts.map((prod) =>
            prod._id.toString()
        );

        const orders = await Order.find({
            "products.productId": { $in: sellerProductIds },
        })
            .populate("products.productId")
            .sort({ purchaseDate: -1 });

        const filteredOrders = filterSellerOrders(orders, sellerProductIds);

        return res.status(200).json({
            success: true,
            orders: filteredOrders,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const getShopOrders = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const { shopIds } = req.body;

        const validShops = await Shop.find({ _id: { $in: shopIds }, sellerId });
        if (validShops.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No valid shops found for this seller",
            });
        }
        const validShopIds = validShops.map((shop) => shop._id);

        const sellerProducts = await Product.find({
            shop: { $in: validShopIds },
        });
        const sellerProductIds = sellerProducts.map((prod) =>
            prod._id.toString()
        );

        const orders = await Order.find({
            "products.productId": { $in: sellerProductIds },
        })
            .populate("products.productId")
            .sort({ purchaseDate: -1 });

        const filteredOrders = filterSellerOrders(orders, sellerProductIds);

        return res.status(200).json({
            success: true,
            orders: filteredOrders,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
