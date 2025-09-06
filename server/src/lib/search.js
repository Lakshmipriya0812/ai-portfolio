import { embedTexts, cosineSimilarity } from './embeddings.js';

export async function buildIndexFromDocuments(documents, options = {}) {
  const texts = documents.map(d => `${d.title}\n${d.content}`);
  const embeddings = await embedTexts(texts, options);
  return {
    options,
    documents,
    vectors: embeddings
  };
}

export async function retrieveRelevant(query, index, topK = 3, options = {}) {
  const [queryVec] = await embedTexts([query], options);
  const scores = index.vectors.map(vec => cosineSimilarity(queryVec, vec));
  const ranked = index.documents
    .map((doc, i) => ({ doc, score: scores[i] }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
  return ranked;
}


