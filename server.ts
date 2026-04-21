import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, 'data.json');

// Estructura de datos inicial para la persistencia
const initialData = {
  videos: [],
  announcements: [],
  heroBgs: [],
  visits: [
    { id: '1', text: "Hoy nos visita Bancolombia para asesoría en crédito de vivienda" }
  ],
  rhVideo: null,
  partyPhotos: [],
  // Boletín Quincenal: Independiente por empresa (SX, SO, PL)
  bulletinQuincenal: {
    SX: [],
    SO: [],
    PL: []
  },
  // Boletín Mensual: Global para todas las empresas
  bulletinMensual: []
};

// Ensure data file exists and is valid
const ensureDataFile = () => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeJsonSync(DATA_FILE, initialData);
    } else {
      const content = fs.readFileSync(DATA_FILE, 'utf8').trim();
      if (content === "") {
        fs.writeJsonSync(DATA_FILE, initialData);
      } else {
        // Try to parse it to ensure it's valid JSON
        JSON.parse(content);
      }
    }
  } catch (error) {
    console.error('Data file corrupted, resetting to initial data');
    fs.writeJsonSync(DATA_FILE, initialData);
  }
};

ensureDataFile();

/**
 * Servidor Express: Maneja la persistencia de datos en data.json y sirve la aplicación.
 */
async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: '200mb' })); // Límite aumentado aún más para evitar fallos con muchas fotos
  app.use(express.urlencoded({ limit: '200mb', extended: true }));

  // --- RUTAS DE LA API ---

  /**
   * GET /api/data: Retorna todos los datos almacenados.
   */
  app.get('/api/data', async (req, res) => {
    try {
      if (!fs.existsSync(DATA_FILE)) {
        return res.json(initialData);
      }
      const data = await fs.readJson(DATA_FILE);
      // Aseguramos que todas las claves existan mezclando con initialData
      const safeData = { 
        ...initialData, 
        ...data,
        videos: (data.videos || []).filter((v: any) => v.title !== 'Mensaje de Gerencia')
      };
      res.json(safeData);
    } catch (error) {
      console.error('Error reading data:', error);
      res.json(initialData);
    }
  });

  /**
   * POST /api/data: Guarda actualizaciones en el archivo data.json.
   */
  app.post('/api/data', async (req, res) => {
    try {
      console.log('--- RECIBIENDO ACTUALIZACIÓN DE DATOS ---');
      console.log('Keys recibidas:', Object.keys(req.body));
      
      let currentData = initialData;
      if (fs.existsSync(DATA_FILE)) {
        try {
          currentData = await fs.readJson(DATA_FILE);
        } catch (e) {
          console.error('Error parsing data file, using initial data');
          currentData = initialData;
        }
      }
      // Mezclamos los datos actuales con los nuevos cambios recibidos
      const newData = { ...currentData, ...req.body };
      await fs.writeJson(DATA_FILE, newData);
      console.log('Datos guardados correctamente en data.json');
      res.json({ success: true, data: newData });
    } catch (error) {
      console.error('ERROR CRÍTICO AL GUARDAR DATOS:', error);
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
