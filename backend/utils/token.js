import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "15m";
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || "7d";

export const generateAccessToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRY,
    });
};

export const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRY,
    });
};
