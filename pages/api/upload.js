import { mongooseConnect } from '@/lib/mongoose';
import { isAdminRequest } from './auth/[...nextauth]';

const handler =  async (req, res) => {
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (req.method === 'POST') {
    const { name, data } = req.body;
    const fs = require('fs');
    const path = require('path');

    // Chuỗi base64 cần giải mã và lưu vào tệp tin
    const base64String = data

    // Tạo đường dẫn và tên tệp tin mới
    const folderPath = './static/images';
    const fileName = name;
    const filePath = path.join(folderPath, fileName);

    // Giải mã chuỗi base64 sang buffer
    const buffer = Buffer.from(base64String, 'base64');

    // Ghi buffer vào tệp tin
    fs.writeFileSync(filePath, buffer);

    // Tạo đường dẫn tới tệp tin ảnh
    const pathToFile = path.join(folderPath, fileName);
    const newFilePath = pathToFile.replace(/\\/g, '/');

    res.json(newFilePath)
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};

export default handler;