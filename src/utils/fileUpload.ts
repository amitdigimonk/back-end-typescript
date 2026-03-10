import { bucket } from '../config/firebase';
import { v4 as uuidv4 } from 'uuid';

export const uploadToFirebase = async (file: Express.Multer.File): Promise<string> => {
  const fileName = `${uuidv4()}_${file.originalname}`;
  const blob = bucket.file(fileName);

  const blobStream = blob.createWriteStream({
    metadata: { contentType: file.mimetype },
    public: true 
  });

  return new Promise((resolve, reject) => {
    blobStream.on('error', (err) => reject(err));
    blobStream.on('finish', () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      resolve(publicUrl);
    });
    blobStream.end(file.buffer);
  });
};