import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { loadKnowledgeBase, ensureStorageDirs } from '../lib/knowledge.js';
import { buildIndexFromDocuments } from '../lib/search.js';
import { saveIndex } from '../lib/indexStore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const model = process.env.EMBEDDINGS_MODEL || 'sentence-transformers/all-MiniLM-L6-v2';
    const storageDir = process.env.STORAGE_DIR ? join(__dirname, '..', '..', process.env.STORAGE_DIR) : join(__dirname, '..', '..', 'storage');

    ensureStorageDirs(storageDir);

    const documents = loadKnowledgeBase();
    const index = await buildIndexFromDocuments(documents, { model });
    saveIndex(storageDir, index);

    res.json({
      success: true,
      message: 'Knowledge base ingested successfully',
      stats: {
        documentCount: index.documents.length,
        vectorCount: index.vectors.length,
        model
      }
    });
  } catch (error) {
    console.error('Ingest error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;


