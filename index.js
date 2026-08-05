import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 8080; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Serve compiled production assets
app.use(express.static(path.join(__dirname, 'dist')));

// 2. CHANGED: Added "splat" name to wildcard to prevent path-to-regexp v8 crash
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});