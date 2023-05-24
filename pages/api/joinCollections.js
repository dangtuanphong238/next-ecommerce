import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  const uri = process.env.MONGODB_URI; // Replace with your MongoDB connection URI
  const client = new MongoClient(uri, { useUnifiedTopology: true });

  try {
    await client.connect();
    const database = client.db('test'); // Replace with your database name

    const result = await database.collection('products').aggregate([
        { $lookup:
            {
              from: 'categories',
              localField: 'category',
              foreignField: '_id',
              as: 'joinedData'
            }
        }
    ]).toArray();

    res.status(200).json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error});
  } finally {
    await client.close();
  }
}
