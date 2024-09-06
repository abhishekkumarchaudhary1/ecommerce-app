import express from 'express';
import { addToCart, getCartByUser, removeFromCart, clearCart, updateCart } from '../controllers/cart.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/add', verifyJWT, addToCart);
router.get('/get-cart-by-user', verifyJWT, getCartByUser);
router.post('/remove', verifyJWT, removeFromCart);
router.post('/update', verifyJWT, updateCart);
router.post('/clear', verifyJWT, clearCart);

export default router;
