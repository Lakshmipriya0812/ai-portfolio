import axios from 'axios';

const HF_TEXT2TEXT_BASE = 'https://router.huggingface.co/hf-inference/models';

export async function rephraseAnswer(answer, userQuestion, {
  model = process.env.REPHRASE_MODEL || 'google/flan-t5-small',
  apiKey = process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY,
} = {}) {
  if (!apiKey) {
    return answer; // silent fallback to raw composed answer
  }

  const prompt = `Rewrite the following answer to the user's question in a concise, friendly first-person tone. Do not add new information.\n\nQuestion: ${userQuestion}\nAnswer: ${answer}\n\nRewritten:`;

  try {
    const resp = await axios.post(
      `${HF_TEXT2TEXT_BASE}/${model}/pipeline/text2text-generation`,
      { inputs: prompt, parameters: { max_new_tokens: 128, temperature: 0.3 }, options: { wait_for_model: true } },
      { headers: { Authorization: `Bearer ${apiKey}` }, timeout: timeoutMs }
    );
    const out = resp?.data?.[0]?.generated_text || resp?.data?.generated_text;
    if (!out) return answer;
    return String(out).trim();
  } catch (err) {
    return answer;
  }
}

export default rephraseAnswer;


