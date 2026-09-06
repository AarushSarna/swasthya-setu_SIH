import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import healthHandler from './api/health.ts';
import extractSymptomsHandler from './api/extract-symptoms.ts';
import ocrDocumentHandler from './api/ocr-document.ts';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Routes mapped to modular /api handlers
  app.all('/api/health', (req, res) => healthHandler(req, res));
  app.all('/api/extract-symptoms', (req, res) => extractSymptomsHandler(req, res));
  app.all('/api/ocr-document', (req, res) => ocrDocumentHandler(req, res));

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
