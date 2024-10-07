import path from 'node:path';
import fs from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url); // Para usar require dentro de um módulo ES
const pdfjsDistPath = path.dirname(require.resolve('pdfjs-dist/package.json'));
const pdfWorkerPath = path.join(pdfjsDistPath, 'build', 'pdf.worker.mjs');

fs.cpSync(pdfWorkerPath, './dist/pdf.worker.mjs', { recursive: true });
