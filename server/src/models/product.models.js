import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    brand: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    sku: {
        type: String,
        required: true,
        unique: true,
    },
    color: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        required: true,
    },
    material: {
        type: String,
        required: true,
    },
    weight: {
        type: String,
        required: true,
    },
    productImage: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});

export const Product = mongoose.model('Product', productSchema);
