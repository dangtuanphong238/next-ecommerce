import { ObjectId } from 'mongodb';
import mongoose, { model, models } from 'mongoose';

const ImageSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    url: { type: String }
})

const ProductSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    images: [{ type: ImageSchema }],
    category: { type: String, ref: 'Category' },
    properties: {type: Object}
},{
    timestamps: true,
})

export const Product = models?.Product || model('Product', ProductSchema)