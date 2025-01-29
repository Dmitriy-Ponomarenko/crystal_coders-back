// src/middlewares/multer.js

import multer from 'multer';
import { TEMP_UPLOAD_DIR } from '../constants/index.js';

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, TEMP_UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, `${uniqueSuffix}_${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'),
      false,
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export { upload };
