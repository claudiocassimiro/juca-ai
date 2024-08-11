import multer from "multer";
import fs from "fs";

export const storage = () =>
  multer.diskStorage({
    destination: (_req, _file, cb) => {
      const uploadPath = "src/document_loaders/pdfs";
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: (_req, file, cb) => {
      cb(null, file.originalname);
    },
  });
