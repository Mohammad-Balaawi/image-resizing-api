import http from 'http';
import app from './app';
import { ensureDirs } from './utils/ensureDir';

const PORT = process.env.PORT || 3000;

async function main() {
  await ensureDirs();
  http.createServer(app).listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}
main();