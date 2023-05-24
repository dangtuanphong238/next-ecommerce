import { Product } from "@/models/Product"
import { mongooseConnect } from "@/lib/mongoose"
import { isAdminRequest } from "./auth/[...nextauth]";
import { Category } from "@/models/Category";

export default async function handle(req, res) {
    const { method } = req
    await mongooseConnect()
    await isAdminRequest(req, res);

    if (method === 'GET') {
        const productDoc = await Product.find()
        const categoryDoc = await Category.find()

        res.json({productDoc,categoryDoc})
    }
}