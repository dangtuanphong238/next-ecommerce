import { Category } from "@/models/Category"
import { mongooseConnect } from "@/lib/mongoose"
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
    const { method } = req
    await mongooseConnect();
    await isAdminRequest(req, res);

    if (method === 'GET') {
        if (req.query?.id) {
            res.json(await Category.findOne({ _id: req.query.id }))
        }
        else {
            res.json(await Category.find().populate('parent'))
        }
    }

    if (method === 'POST') {
        const { _id, name, parentCategory, properties } = req.body
        const categoryDoc = await Category.create({
            _id,
            name,
            parent: parentCategory || undefined,
            properties
        })
        console.log("package", req.body, { categoryDoc })
        res.json(categoryDoc)
    }

    if (method === 'PUT') {
        const { name, parentCategory, _id, properties } = req.body
        const categoryDoc = await Category.updateOne({ _id }, {
            name,
            parent: parentCategory,
            properties
        })
        res.json(categoryDoc)
    }

    if (method === 'DELETE') {
        if (req.query?._id) {
            await Category.deleteOne({ _id: req.query?._id })
            res.json(true)
        }
    }
}