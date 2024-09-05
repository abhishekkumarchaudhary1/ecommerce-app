import express from 'express';
import {
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
    addOrder
} from '../controllers/order.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Create a new order
router.post('/add', verifyJWT, addOrder);

// Get all orders (Admin access or specific user)
router.get('/get-orders', verifyJWT, getAllOrders);

// Get a single order by ID
router.get('/:orderId', verifyJWT, getOrderById);

// Update an order by ID
router.put('/:orderId', verifyJWT, updateOrder);

// Delete an order by ID
router.delete('/:orderId', verifyJWT, deleteOrder);

export default router;
