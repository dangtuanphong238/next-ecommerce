import mongoose, { model, models } from 'mongoose';

const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true }
})

export const Product = models.Product || model('Product', ProductSchema)