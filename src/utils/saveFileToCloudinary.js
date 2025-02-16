// src/utils/saveFileToCloudinary.js

import fs from 'node:fs/promises';
import cloudinary from 'cloudinary';
import { env } from './env.js';

cloudinary.v2.config({
  secure: true,
  cloud_name: env('CLOUD_NAME'),
  api_key: env('API_KEY'),
  api_secret: env('API_SECRET'),
});

export const saveFileToCloudinary = async (file) => {
  try {
    const response = await cloudinary.v2.uploader.upload(file.path);
    await fs.unlink(file.path);
    return response.secure_url;
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);
    throw new Error('Failed to upload file to Cloudinary');
  }
};
