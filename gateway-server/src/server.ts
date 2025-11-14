import cors from 'cors';
import dotenv from 'dotenv';
import express, { Application, NextFunction, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { ApiResponse, GatewayManifest, HealthCheckResponse, ProcessedGateway } from './types';

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '8080', 10);

const envPath = path.join(__dirname, '../../wordpress/.env');
dotenv.config({ path: envPath });

// Enable CORS for cross-origin requests
app.use(cors());

// Parse JSON bodies
app.use(express.json());

const gatewaysDir: string = path.join(__dirname, '..', 'gateways');
const baseUrl: string = process.env.GF_REMOTE_REQUEST_BASE_URL || 'http://localhost:8080';

// Routes

// Health check endpoint
app.get('/', (req: Request, res: Response<HealthCheckResponse>) => {
  return res.json({
    message: 'Gateway Server is running!',
    endpoints: {
      download: 'GET /download/:filename',
      'payment-gateways': 'GET /payment-gateways',
      'static-assets': 'GET /gateways/:gateway/:file (for logos and assets)',
    },
  });
});

// Download zip file endpoint
app.get('/download/:filename', (req: Request<{ filename: string }>, res: Response<ApiResponse>) => {
  try {
    const filename: string = req.params.filename;
    const directoryPath: string = path.join(gatewaysDir, filename.replace('.zip', ''));
    const filepath: string = path.join(directoryPath, filename);

    // Check if file exists
    if (!fs.existsSync(directoryPath) || !fs.existsSync(filepath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Check if it's a zip file
    if (path.extname(filename).toLowerCase() !== '.zip') {
      return res.status(400).json({ error: 'Invalid file type' });
    }

    // Set appropriate headers for file download
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Stream the file
    const fileStream = fs.createReadStream(filepath);
    fileStream.pipe(res);

    fileStream.on('error', (error: Error) => {
      console.error('Download error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to download file' });
      }
    });

    return; // Explicit return for successful path
  } catch (error) {
    console.error('Download error:', error);
    if (!res.headersSent) {
      return res.status(500).json({ error: 'Failed to download file' });
    }
    return; // Explicit return for error path
  }
});

// Serve only image files from gateways directory (block manifest.json and other sensitive files)
app.use('/gateways', (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  const allowedExtensions: string[] = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico'];
  const fileExtension: string = path.extname(req.path).toLowerCase();

  // Block access to .json files and other non-image files
  if (!allowedExtensions.includes(fileExtension)) {
    return res.status(403).json({ error: 'Access denied. Only image files are allowed.' });
  }

  // If it's an allowed image file, serve it statically
  return express.static(gatewaysDir)(req, res, next);
});

app.get('/payment-gateways', (req: Request, res: Response<ProcessedGateway[]>) => {
  try {
    const files: ProcessedGateway[] = fs
      .readdirSync(gatewaysDir)
      .filter((file: string): boolean => {
        // Check if it's a directory (not a file with extension)
        const dirPath: string = path.join(gatewaysDir, file);
        if (!fs.statSync(dirPath).isDirectory()) return false;

        // Check if manifest.json exists in the directory
        const manifestPath: string = path.join(dirPath, 'manifest.json');
        return fs.existsSync(manifestPath);
      })
      .map((file: string): ProcessedGateway => {
        const manifestPath: string = path.join(gatewaysDir, file, 'manifest.json');
        const manifestContent: string = fs.readFileSync(manifestPath, 'utf8');
        const manifest: GatewayManifest = JSON.parse(manifestContent);

        return {
          ...manifest,
          config: {
            ...manifest.config,
            logo: `${baseUrl}${manifest.config.logo}`,
          },
          name: manifest.name,
          download_url: `${baseUrl}${manifest.download_url}`,
        };
      });

    return res.json(files);
  } catch (error) {
    console.error('Error reading payment gateways:', error);
    return res.status(500).json([]);
  }
});

// Error handling middleware
app.use((error: any, req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  console.error('Server error:', error);
  return res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, '0.0.0.0', (): void => {
  console.log(`Gateway Server is running on port ${PORT}`);
  console.log(`Payment gateways: http://localhost:${PORT}/payment-gateways`);
  console.log(`Download: http://localhost:${PORT}/download/<filename>`);
  console.log(`Static assets: http://localhost:${PORT}/gateways/<gateway>/<file>`);
});

export default app;
