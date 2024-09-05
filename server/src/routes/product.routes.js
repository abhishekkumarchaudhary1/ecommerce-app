import express from 'express';
import { upload } from '../middlewares/multer.middleware.js';
import {
    addProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    productTestApi
} from '../controllers/product.controller.js';

const router = express.Router();

//productTestApi
router.get('/product-test-api', productTestApi)

// Add a new product
router.post('/add', upload.fields([{ name: 'productImage', maxCount: 1 }]), addProduct);

// Get all products
router.get('/get-products', getAllProducts);

// Get a product by ID
router.get('/:productId', getProductById);

// Update a product by ID
router.put('/:productId', upload.fields([{ name: 'avatar', maxCount: 1 }]), updateProduct);

// Delete a product by ID
router.delete('/:productId', deleteProduct);

export default router;
