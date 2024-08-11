import { Router } from "express";
import multer from "multer";
import pdfController from "../controllers/pdfController/handlerPdf";
import { storage } from "../utils/storage";

const router = Router();

const upload = multer({ storage: storage() });

router.post("/api/files", upload.single("file"), pdfController.save);
router.delete("/api/deleteAllDocs", pdfController.deleteAllDocuments);
router.get("/api/saveManyPdfs", pdfController.saveManyPdfs);

export default router;
