import { Product } from "@/models/Product"
import { mongooseConnect } from "@/lib/mongoose"
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
    const { method } = req
    await mongooseConnect()
    await isAdminRequest(req, res);

    if (method === 'POST') {
        const productDoc = await Product.create(req.body)
        res.json(productDoc)
    }
}