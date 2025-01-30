// src/routes/uploadRoutes.js

import express from 'express';
import multer from 'multer';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

router.post(
  '/upload',
  upload.single('file'),
  (req, res) => {
    res.json({ message: 'File uploaded successfully' });
  },
  (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      return res
        .status(400)
        .json({ message: 'File upload error: ' + err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }
  },
);

export default router;
