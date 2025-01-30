// src/server.js

import express from 'express';
// import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import router from './routers/index.js';
import cookieParser from 'cookie-parser';
// import { UPLOAD_DIR } from './constants/index.js';
import uploadRoutes from './routers/upload.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';
import { limiter } from './middlewares/rateLimit.js';
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
  app.use(limiter);

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(router);

  app.use('/api', uploadRoutes);

  app.use('/api-docs', swaggerDocs());

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
