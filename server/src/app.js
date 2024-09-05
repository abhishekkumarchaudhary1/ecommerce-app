import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Initialize express app
const app = express();

// Middleware setup
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// Import routes
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import productRouter from './routes/product.routes.js';
import orderRouter from './routes/order.routes.js';
import cartRouter from './routes/cart.routes.js'

// Use routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.use('/api/cart', cartRouter);


// Export the app
export { app };
