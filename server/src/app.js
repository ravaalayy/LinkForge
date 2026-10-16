import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import apiRoutes from './routes/api.js';
import redirectRoutes from './routes/redirect.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Security headers
app.use(helmet());
// CORS setup (mengizinkan local dev)
app.use(cors());
// Parse JSON body
app.use(express.json());

// Routes
app.use('/api', apiRoutes);
// Root endpoint - info sederhana
app.get('/', (req, res) => {
  res.json({
    message: 'LinkForge API Server is running',
    health: '/api/health',
    links: '/api/links'
  });
});
app.use('/', redirectRoutes); // Fallback ke redirect jika path bukan /api

// Error handling terpusat
app.use(errorHandler);

export default app;