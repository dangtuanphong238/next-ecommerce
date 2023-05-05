import mongoose, { model, models } from 'mongoose';

const CategorySchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    parent: { type: String, ref: 'Category' }, //id
    properties: [{ type: Object }]
})

export const Category = models?.Category || model('Category', CategorySchema)