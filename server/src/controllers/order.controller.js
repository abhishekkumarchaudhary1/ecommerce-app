import { Order } from '../models/order.models.js';
import { Product } from '../models/product.models.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// Add a new order
export const addOrder = asyncHandler(async (req, res) => {
    const { userId, products } = req.body;

    if (!userId || !products || !products.length) {
        throw new ApiError(400, "User ID and products are required");
    }

    let totalAmount = 0;

    // Calculate the total amount
    for (const item of products) {
        const product = await Product.findById(item.productId);
        if (!product) {
            throw new ApiError(404, `Product with ID ${item.productId} not found`);
        }
        totalAmount += product.price * item.quantity;
    }

    // Create the order
    const order = await Order.create({
        userId,
        products,
        totalAmount,
        status: 'Pending',  // or any default status
        orderDate: new Date()
    });

    return res.status(201).json(new ApiResponse(201, order, "Order added successfully"));
});

// Get all orders
export const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find();
    return res.status(200).json(new ApiResponse(200, orders, "All orders fetched successfully"));
});

// Get a single order by ID
export const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
        throw new ApiError(404, "Order not found");
    }
    return res.status(200).json(new ApiResponse(200, order, "Order fetched successfully"));
});

// Update an order by ID
export const updateOrder = asyncHandler(async (req, res) => {
    const { status } = req.body;

    const order = await Order.findById(req.params.orderId);
    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    order.status = status || order.status;
    await order.save();

    return res.status(200).json(new ApiResponse(200, order, "Order updated successfully"));
});

// Delete an order by ID
export const deleteOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    // Check if the order exists
    const order = await Order.findById(orderId)
    
    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    // Delete the order
    await Order.deleteOne({ _id: orderId });

    return res.status(200).json(new ApiResponse(200, null, "Order deleted successfully"));
});