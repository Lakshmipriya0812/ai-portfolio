import axios from 'axios';

// Use HF Router feature-extraction endpoint for Qwen embeddings
const HF_ROUTER_FEATURE_EXTRACTION = 'https://router.huggingface.co/hf-inference/models';

export async function embedTexts(texts, { model = 'sentence-transformers/all-MiniLM-L6-v2', apiKey = process.env.HUGGINGFACE_API_KEY } = {}) {
  if (!apiKey) {
    throw new Error('HF_TOKEN (or HUGGINGFACE_API_KEY) is required for embeddings');
  }

  const inputs = Array.isArray(texts) ? texts : [texts];
  // Enforce: inputs must be an array of strings only
  if (!Array.isArray(inputs) || inputs.some(t => typeof t !== 'string')) {
    throw new Error('embedTexts expects "texts" to be an array of strings');
  }
  // Prefer a widely available free embedding model on HF
  const preferred = ['sentence-transformers/all-MiniLM-L6-v2'];
  const modelFallbacks = preferred;

  let lastError;
  for (const candidate of modelFallbacks) {
    try {
      // Compose router URL: /hf-inference/models/{model}/pipeline/feature-extraction
      const primaryBase = `${HF_ROUTER_FEATURE_EXTRACTION}`;

      // Batch to avoid payload issues
      const batchSize = 8;
      const allVectors = [];

      // Helper to run one endpoint batched
      const runEndpoint = async (baseUrl) => {
        const vectorsOut = [];
        for (let start = 0; start < inputs.length; start += batchSize) {
          const batch = inputs.slice(start, start + batchSize);
          let attempt = 0;
          let resp;
          while (true) {
            try {
              resp = await axios.post(
                `${baseUrl}/${candidate}/pipeline/feature-extraction`,
                { inputs: batch, options: { wait_for_model: true } },
                { headers: { Authorization: `Bearer ${apiKey}` } }
              );
              break;
            } catch (err) {
              const status = err?.response?.status;
              if (status === 404 || status === 503) {
                if (attempt < 2) {
                  attempt++;
                  await new Promise(r => setTimeout(r, 1500));
                  continue;
                }
              }
              throw err;
            }
          }
          const payload = resp.data;
          const vectors = Array.isArray(payload?.embeddings) ? payload.embeddings : payload;
          for (const v of vectors) {
            vectorsOut.push(Array.isArray(v[0]) ? averageTokenEmbeddings(v) : v);
          }
        }
        return vectorsOut;
      };

      // Try primary endpoint first
      const out = await runEndpoint(primaryBase);
      return out;
    } catch (err) {
      const status = err?.response?.status;
      const body = err?.response?.data;
      if (status) {
        console.error(`HF embeddings error for ${candidate}: status ${status}`, body);
      }
      lastError = err;
    }
  }
  throw lastError || new Error('Failed to obtain embeddings');
}

function averageTokenEmbeddings(tokenEmbeddings) {
  const length = tokenEmbeddings.length;
  const dim = tokenEmbeddings[0].length;
  const sum = new Array(dim).fill(0);
  for (let i = 0; i < length; i++) {
    const token = tokenEmbeddings[i];
    for (let d = 0; d < dim; d++) {
      sum[d] += token[d];
    }
  }
  return sum.map(x => x / length);
}

export function cosineSimilarity(a, b) {
  let dot = 0, aNorm = 0, bNorm = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    aNorm += a[i] * a[i];
    bNorm += b[i] * b[i];
  }
  return dot / (Math.sqrt(aNorm) * Math.sqrt(bNorm));
}


