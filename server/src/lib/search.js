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

function parseDate(str) {
  if (!str) return new Date(0); // fallback if no date
  if (str.toLowerCase().includes('present')) return new Date(); // treat "Present" as today
  return new Date(str);
}

export async function retrieveRelevant(query, index, options = {}) {
  const [queryVec] = await embedTexts([query], options);
  const scores = index.vectors.map(vec => cosineSimilarity(queryVec, vec));

  let ranked = index.documents
    .map((doc, i) => ({ doc, score: scores[i] }))
    .sort((a, b) => b.score - a.score);

  const expectedType = detectExpectedType(query);

  if (expectedType) {
    const filtered = ranked.filter(r => r.doc.type.toLowerCase() === expectedType.toLowerCase());
    if (filtered.length > 0) ranked = filtered;
  }    

  // Remove duplicates
  const uniqueRanked = [];
  const seen = new Set();
  for (const r of ranked) {
    if (!seen.has(r.doc.id)) {
      seen.add(r.doc.id);
      uniqueRanked.push(r);
    }
  }

  return uniqueRanked;
}

function detectExpectedType(query) {
  query = query.toLowerCase();
  if (query.includes('experience') || query.includes('job') || query.includes('work') || query.includes('internship')) return 'experience';
  if (query.includes('project')) return 'project';
  if (query.includes('education') || query.includes('study')) return 'education';
  if (query.includes('skills') || query.includes('know')) return 'skills';
  if (query.includes('contact')) return 'contact';
  if (query.includes('about')) return 'about';
  return null;
}
