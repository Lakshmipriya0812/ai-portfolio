import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export function saveIndex(storageDir, index) {
  if (!existsSync(storageDir)) {
    mkdirSync(storageDir, { recursive: true });
  }
  writeFileSync(join(storageDir, 'index.json'), JSON.stringify(index, null, 2), 'utf-8');
}

export function loadIndex(storageDir) {
  const path = join(storageDir, 'index.json');
  if (!existsSync(path)) return null;
  const raw = readFileSync(path, 'utf-8');
  return JSON.parse(raw);
}


