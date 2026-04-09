import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, 'data.json');

// Initial data structure
const initialData = {
  videos: [
    { id: 1, title: 'Mensaje de Gerencia', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
  ],
  announcements: [],
  heroBgs: [],
  visitInfo: "Hoy nos visita Bancolombia para asesoría en crédito de vivienda",
  rhVideo: null,
  partyPhotos: []
};

// Ensure data file exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeJsonSync(DATA_FILE, initialData);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));

  // API Routes
  app.get('/api/data', async (req, res) => {
    try {
      const data = await fs.readJson(DATA_FILE);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to read data' });
    }
  });

  app.post('/api/data', async (req, res) => {
    try {
      const currentData = await fs.readJson(DATA_FILE);
      const newData = { ...currentData, ...req.body };
      await fs.writeJson(DATA_FILE, newData);
      res.json({ success: true, data: newData });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save data' });
    }
  });

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
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
