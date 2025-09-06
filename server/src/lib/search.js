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
    .sort((a, b) => b.score - a.score);

  const expectedType = detectExpectedType(query);
  if (expectedType) {
    for (const r of ranked) {
      const section = r.doc.type || r.doc.metadata?.section;
      if (section === expectedType) {
        r.score += 0.1; 
      }
    }
    ranked.sort((a, b) => b.score - a.score);
  }

  return ranked.slice(0, topK);
}

function detectExpectedType(query) {
  query = query.toLowerCase();
  if (query.includes('experience') || query.includes('worked at')) return 'experience';
  if (query.includes('project')) return 'project';
  if (query.includes('education') || query.includes('study')) return 'education';
  if (query.includes('skills') || query.includes('know')) return 'skills';
  if (query.includes('contact')) return 'contact';
  if (query.includes('about')) return 'about';
  return null;
}
