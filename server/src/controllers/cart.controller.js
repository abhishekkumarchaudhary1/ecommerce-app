import { Cart } from '../models/cart.models.js';
import { Product } from '../models/product.models.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// Add product to cart
export const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, 'Product not found');
    }

    // Find the cart for the user or create a new one
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
        cart = await Cart.create({ user: userId, products: [] });
    }

    // Check if the product is already in the cart
    const existingProduct = cart.products.find(item => item.product.toString() === productId);
    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.products.push({ product: productId, quantity });
    }

    // Calculate the total amount
    cart.totalAmount = await calculateTotalAmount(cart.products);

    await cart.save();
    return res.status(200).json(new ApiResponse(200, cart, "Product added to cart"));
});

// Calculate total amount helper function
const calculateTotalAmount = async (cartProducts) => {
    let total = 0;
    for (let item of cartProducts) {
        const product = await Product.findById(item.product);
        total += product.price * item.quantity;
    }
    return total;
};

// Get cart by user
export const getCartByUser = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId }).populate('products.product');
    if (!cart) {
        throw new ApiError(404, 'Cart not found');
    }

    return res.status(200).json(new ApiResponse(200, cart, "Cart fetched successfully"));
});

// Remove product from cart
export const removeFromCart = asyncHandler(async (req, res) => {
    const { productId } = req.body;
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        throw new ApiError(404, 'Cart not found');
    }

    cart.products = cart.products.filter(item => item.product.toString() !== productId);
    
    // Recalculate the total amount
    cart.totalAmount = await calculateTotalAmount(cart.products);

    await cart.save();
    return res.status(200).json(new ApiResponse(200, cart, "Product removed from cart"));
});

// Clear the cart
export const clearCart = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        throw new ApiError(404, 'Cart not found');
    }

    cart.products = [];
    cart.totalAmount = 0;

    await cart.save();
    return res.status(200).json(new ApiResponse(200, cart, "Cart cleared successfully"));
});
