import app from './app.js';
import dotenv from 'dotenv';
import path from 'path';

// Load .env dari root folder
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Backend LinkForge berjalan di http://localhost:${PORT}`);
});