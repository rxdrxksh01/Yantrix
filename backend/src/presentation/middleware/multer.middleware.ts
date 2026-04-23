import multer from 'multer';
import type { StorageEngine } from 'multer';
import type { Request } from 'express';
import path from 'path';


const uploadPath = path.resolve(process.cwd(), 'public/uploads');

// Define storage
const storage: StorageEngine = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, uploadPath);
  },

  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}`);
  },
});

// Create upload instance
const upload = multer({ storage });

export default upload;