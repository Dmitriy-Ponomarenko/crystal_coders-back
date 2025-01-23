// src/server.js

import express from 'express';
// import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import router from './routers/index.js';
import cookieParser from 'cookie-parser';
import { UPLOAD_DIR } from './constants/index.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';
import path from 'path';

const PORT = Number(env('PORT', '3000'));

export const startServer = () => {
  const app = express();

  const corsOptions = {
    origin: [
      'https://crystal-coders-back.onrender.com',
      'https://crystal-coders-front.vercel.app',
      'http://localhost:5173',
      'https://crystal-coders.netlify.app',
    ],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  };

  app.use(express.json());
  app.use(cors(corsOptions));
  app.use(cookieParser());

  // app.use(
  //   pino({
  //     transport: {
  //       target: 'pino-pretty',
  //     },
  //   }),
  // );

  app.use(router);

  app.use('/uploads', (req, res, next) => {
    const allowedExtensions = ['.png', '.jpg', '.jpeg'];
    const fileExtension = path.extname(req.url).toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      return res.status(403).send('Access denied');
    }

    express.static(UPLOAD_DIR)(req, res, next);
  });

  app.use('/api-docs', swaggerDocs());

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
