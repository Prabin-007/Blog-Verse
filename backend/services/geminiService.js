const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const GEMINI_MODEL = "gemini-2.5-flash";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = "deepseek/deepseek-chat-v3.1:free";

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function withRetry(fn, { retries = 2, baseDelay = 800 } = {}) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const status = err?.status || err?.response?.status;
      const isRetryable = status === 429 || status === 503;

      if (!isRetryable || attempt === retries) throw err;

      const delay = baseDelay * 2 ** attempt + Math.random() * 300;
      console.warn(`Provider ${status}, retrying in ${Math.round(delay)}ms (attempt ${attempt + 1}/${retries})`);
      await sleep(delay);
    }
  }
}

const geminiCall = async (prompt) => {
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
  });
  return response.text.trim();
};

const openRouterCall = async (prompt) => {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://github.com/Prabin-007/BlogVerse",
      "X-Title": "Blog Verse",
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!response.ok) {
    const errText = await response.text();
    const error = new Error(`OpenRouter error ${response.status}: ${errText}`);
    error.status = response.status;
    throw error;
  }
  const data = await response.json();
  return data.choices[0].message.content.trim();
};

// Round-robin between providers, with cross-provider fallback if one fails
let counter = 0;
const providers = [
  { name: "gemini", call: geminiCall },
  { name: "openrouter", call: openRouterCall },
];

const generate = async (prompt) => {
  const primary = providers[counter % providers.length];
  const fallback = providers[(counter + 1) % providers.length];
  counter++;

  try {
    return await withRetry(() => primary.call(prompt));
  } catch (err) {
    console.warn(`${primary.name} failed, falling back to ${fallback.name}:`, err.message);
    return withRetry(() => fallback.call(prompt));
  }
};

// Returns a short summary of the blog body
const summarizeText = async (text) => {
  return generate(
    `Summarize the following blog post in 3-4 concise sentences. Only return the summary, no preamble:\n\n${text}`
  );
};

// Returns grammar-corrected version of the blog body
const fixGrammar = async (text) => {
  return generate(
    `Correct only the grammar, spelling, and punctuation mistakes in the following text. Do not change the meaning, tone, or style. Return ONLY the corrected text, nothing else:\n\n${text}`
  );
};

module.exports = { summarizeText, fixGrammar };