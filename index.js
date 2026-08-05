import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 8080;

// Replicate __dirname functionality for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve the static files from the Vite build directory
app.use(express.static(path.join(__dirname, 'dist')));

// Send all requests to index.html so React/Vue SPA routing works
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Bind server to Discloud required host and port
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running successfully on port ${PORT}`);
});
