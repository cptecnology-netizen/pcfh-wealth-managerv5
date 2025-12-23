
import express from 'express';
import reportsRouter from './routes/reports.js';

const app = express();
app.use(express.json());

// API Routes
app.use('/api/reports', reportsRouter);

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

export default app;
