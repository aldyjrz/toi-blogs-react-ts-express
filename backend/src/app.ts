import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { env } from '@/config/env';
import { errorHandler, notFoundHandler } from '@/middlewares/errorHandler';
import { apiRateLimiter } from '@/middlewares/rateLimiter';
import authRoutes from '@/routes/auth.routes';
import postRoutes from '@/routes/post.routes';
import taxonomyRoutes from '@/routes/taxonomy.routes';
import mediaRoutes from '@/routes/media.routes';
import contentRoutes from '@/routes/content.routes';
import adminRoutes from '@/routes/admin.routes';
import seoRoutes from '@/routes/seo.routes';
import pageRoutes from '@/routes/page.routes';
import { swaggerSpec } from '@/config/swagger';
import swaggerUi from 'swagger-ui-express';

export function createApp(): express.Express {
  const app = express();
  app.use((req, res, next) => {
  const start = performance.now();

  res.on("finish", () => {
    const duration = performance.now() - start;

    console.log(
      `${req.method} ${req.originalUrl} ${res.statusCode} ${duration.toFixed(2)}ms`
    );
  });

  next();
});

  app.use(helmet({ contentSecurityPolicy: false }));
  const corsOrigins = env.clientOrigin.split(',').map((s) => s.trim()).filter(Boolean);
  corsOrigins.push(
  'http://localhost:5173',
  'http://localhost:8080',
  'http://localhost:3000',
  'https://blog.aldytoi.my.id',
    'https://aldytoi.my.id'

);
  if (corsOrigins.length === 0) {
    corsOrigins.push('http://localhost:8081', 'http://localhost:80', 'http://localhost');
  }
  app.use(cors({ origin: (origin, callback) => {
    if (!origin || corsOrigins.includes(origin) || env.isProduction === false) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  }, credentials: true }));
  app.use(compression());
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  if (!env.isProduction) app.use(morgan('dev'));
  app.use(apiRateLimiter);

  

  app.get('/health', (_req, res) => res.json({ success: true, status: 'ok' }));
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/posts', postRoutes);
  app.use('/api/v1/content', contentRoutes);
  app.use('/api/v1/taxonomy', taxonomyRoutes);
  app.use('/api/v1/media', mediaRoutes);
  app.use('/api/v1/admin', adminRoutes);
  app.use('/api/v1', pageRoutes);
  app.use('/', seoRoutes);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
