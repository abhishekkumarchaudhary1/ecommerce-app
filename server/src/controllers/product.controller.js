import { Product } from '../models/product.models.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

export const productTestApi = asyncHandler(async(req, res)=> {

    return res.status(201).json(new ApiResponse(201, "Product is working correctly"));
})

// Add a new product
export const addProduct = asyncHandler(async (req, res) => {
    const { name, description, brand, category, price, stock, sku, color, size, material, weight } = req.body;

    // Validate required fields
    if (!name || !description || !brand || !category || !price || !stock || !sku || !color || !size || !material || !weight) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if SKU is already taken
    const existingProduct = await Product.findOne({ sku });
    if (existingProduct) {
        throw new ApiError(409, "Product with this SKU already exists");
    }

    // Validate image upload
    const productImageLocalPath = req.files?.productImage[0]?.path;
    if (!productImageLocalPath) {
        throw new ApiError(400, "Product image is required");
    }

    // Upload image to Cloudinary
    const productImage = await uploadOnCloudinary(productImageLocalPath);
    if (!productImage) {
        throw new ApiError(500, "Error uploading product image");
    }

    // Create the product
    const product = await Product.create({
        name,
        description,
        brand,
        category,
        price,
        stock,
        sku,
        color,
        size,
        material,
        weight,
        productImage: productImage.url
    });

    return res.status(201).json(new ApiResponse(201, product, "Product added successfully"));
});

// Get all products
export const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find();
    return res.status(200).json(new ApiResponse(200, products, "All products fetched successfully"));
});

// Get a single product by ID
export const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.productId);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }
    return res.status(200).json(new ApiResponse(200, product, "Product fetched successfully"));
});

// Update a product by ID
export const updateProduct = asyncHandler(async (req, res) => {
    const { name, description, brand, category, price, stock, sku, color, size, material, weight } = req.body;

    const product = await Product.findById(req.params.productId);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    // Check if SKU is already taken by another product
    if (sku && sku !== product.sku) {
        const existingProduct = await Product.findOne({ sku });
        if (existingProduct) {
            throw new ApiError(409, "Product with this SKU already exists");
        }
    }

    // Update fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.price = price || product.price;
    product.stock = stock || product.stock;
    product.sku = sku || product.sku;
    product.color = color || product.color;
    product.size = size || product.size;
    product.material = material || product.material;
    product.weight = weight || product.weight;

    if (req.files?.productImage?.[0]) {
        const productImageLocalPath = req.files.productImage[0].path;
        const productImage = await uploadOnCloudinary(productImageLocalPath);
        if (!productImage) {
            throw new ApiError(500, "Error uploading product image");
        }
        product.productImage = productImage.url;
    }

    await product.save();
    return res.status(200).json(new ApiResponse(200, product, "Product updated successfully"));
});

// Delete a product by ID
export const deleteProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    
    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    // Delete the product
    await Product.deleteOne({ _id: productId });

    return res.status(200).json(new ApiResponse(200, null, "Product deleted successfully"));
});

