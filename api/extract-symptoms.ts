import { GoogleGenAI } from '@google/genai';

function cleanJsonText(raw: string): string {
  let text = (raw || '').trim();
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  }
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace >= firstBrace) {
    text = text.substring(firstBrace, lastBrace + 1);
  }
  return text.trim();
}

function toTitleCase(str: string): string {
  if (!str) return '';
  return str
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

/**
 * Robust rule-based fallback symptom extractor.
 * Used ONLY if the Gemini API call fails or times out.
 * Extracts symptoms in Title Case without restricting to a rigid single list.
 */
function localExtractSymptoms(text: string): string[] {
  if (!text || typeof text !== 'string') return [];
  const lower = text.toLowerCase();
  const found: string[] = [];

  // 1. Common pain patterns (<location> pain or hurts)
  const painLocations = [
    'leg', 'knee', 'foot', 'arm', 'hand', 'shoulder', 'neck', 'back',
    'chest', 'eye', 'ear', 'throat', 'stomach', 'belly', 'abdomen', 'head', 'tooth', 'joint'
  ];
  for (const loc of painLocations) {
    if (lower.includes(`${loc} pain`) || lower.includes(`pain in ${loc}`) || lower.includes(`pain in my ${loc}`)) {
      found.push(toTitleCase(`${loc} pain`));
    }
  }

  // 2. Specific phrases & symptom keywords
  if (lower.includes('stomach hurts') || lower.includes('stomach ache') || lower.includes('tummy hurts') || lower.includes('abdominal pain')) {
    found.push('Stomach Pain');
  }
  if (lower.includes('dizzy') || lower.includes('dizziness') || lower.includes('lightheaded')) {
    found.push('Dizziness');
  }
  if (lower.includes('fever') || lower.includes('high temperature') || lower.includes('feverish')) {
    found.push('Fever');
  }
  if (lower.includes('headache') || lower.includes('head ache') || lower.includes('head hurts')) {
    found.push('Headache');
  }
  if (lower.includes('cough') || lower.includes('coughing')) {
    found.push('Cough');
  }
  if (lower.includes('fatigue') || lower.includes('tiredness') || lower.includes('exhausted')) {
    found.push('Fatigue');
  }
  if (lower.includes('sore throat')) {
    found.push('Sore Throat');
  }
  if (lower.includes('chest congestion') || lower.includes('chest burning')) {
    found.push('Chest Congestion');
  }
  if (lower.includes('nausea') || lower.includes('queasy')) {
    found.push('Nausea');
  }
  if (lower.includes('vomit') || lower.includes('vomiting')) {
    found.push('Vomiting');
  }
  if (lower.includes('shortness of breath') || lower.includes('breathless') || lower.includes('trouble breathing')) {
    found.push('Shortness of breath');
  }
  if (lower.includes('chills')) {
    found.push('Chills');
  }
  if (lower.includes('body ache') || lower.includes('body pain')) {
    found.push('Body Ache');
  }

  return Array.from(new Set(found));
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const startTime = Date.now();

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { text, language } = body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required', symptoms: [] });
    }

    console.log(`[Extract Symptoms API] Request received for text: "${text}" (lang: ${language || 'en'})`);

    const ai = getAi();
    if (!ai) {
      console.warn('[Extract Symptoms API] GEMINI_API_KEY is not configured! Falling back to local symptom extraction.');
      const fallbackList = localExtractSymptoms(text);
      return res.status(200).json({
        symptoms: fallbackList,
        source: 'fallback',
        isFallback: true,
        fallbackWarning: 'GEMINI_API_KEY environment variable is missing on server. Using rule-based fallback.',
      });
    }

    // Open-ended extraction prompt: explicitly allows ANY symptom in patient's own words
    const prompt = `You are an expert clinical intake assistant for an OPD clinic.
A patient has provided the following statement describing what they are experiencing:
"${text}"
Input language: ${language || 'en'}.

Your task is to extract ANY and ALL symptoms, physical complaints, bodily discomforts, pains, or clinical issues mentioned in this statement.
CRITICAL INSTRUCTIONS:
1. Do NOT restrict yourself to a predefined or fixed list of symptoms. Patients may report any symptom or body part in their own words (e.g. "leg pain", "knee pain", "stomach hurts", "dizziness", "burning sensation", "eye irritation", "severe headache", "nausea", "back pain", "blurred vision").
2. Normalize each symptom into a concise Title Case clinical phrase (e.g., "Leg Pain", "Stomach Pain", "Dizziness", "Eye Pain", "Fever", "Back Ache", "Chest Tightness", "Vomiting", "Sore Throat").
   - "I have leg pain" -> ["Leg Pain"]
   - "My stomach hurts and I feel dizzy" -> ["Stomach Pain", "Dizziness"]
   - "I have severe eye pain and fever since yesterday" -> ["Eye Pain", "Fever"]
3. If no symptoms, complaints, or discomforts are mentioned (e.g. only greetings, personal identity confirmation, or saying they feel fine), return an empty array for symptoms.
4. Extract as an open-ended array of free-text strings.

Return ONLY a JSON object in this exact format:
{
  "symptoms": ["Leg Pain", "Fever"]
}`;

    const modelsToTry = ['gemini-2.5-flash', 'gemini-3.8-flash', 'gemini-flash-latest'];
    let lastModelError: any = null;
    let rawResponseText = '';
    let successfulModel = '';

    for (const model of modelsToTry) {
      try {
        console.log(`[Extract Symptoms API] Calling Gemini model: ${model}...`);
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });
        rawResponseText = response.text?.trim() || '';
        successfulModel = model;
        console.log(`[Extract Symptoms API] Model ${model} responded in ${Date.now() - startTime}ms.`);
        console.log(`[Extract Symptoms API] Raw Gemini response:\n${rawResponseText}`);
        break;
      } catch (err: any) {
        console.warn(`[Extract Symptoms API] Model ${model} failed (${err?.message || err}). Trying next model...`);
        lastModelError = err;
      }
    }

    // If all Gemini models failed, visibly surface the failure instead of silently degrading
    if (!rawResponseText) {
      console.error('[Extract Symptoms API] CRITICAL ERROR: All Gemini models failed to respond!', lastModelError);
      console.warn('[Extract Symptoms API] Engaging fallback extraction. Falling back to local symptom rules.');
      const fallbackList = localExtractSymptoms(text);
      return res.status(200).json({
        symptoms: fallbackList,
        source: 'fallback',
        isFallback: true,
        fallbackWarning: `Gemini API call failed: ${lastModelError?.message || 'Models unavailable'}. Using rule-based fallback.`,
        geminiError: lastModelError?.message,
      });
    }

    const cleanedJson = cleanJsonText(rawResponseText);
    let parsed: { symptoms?: any } = {};
    try {
      parsed = JSON.parse(cleanedJson);
    } catch (parseErr: any) {
      console.error('[Extract Symptoms API] JSON.parse error on response:', parseErr?.message);
      console.error('[Extract Symptoms API] Raw response was:', rawResponseText);
      const fallbackList = localExtractSymptoms(text);
      return res.status(200).json({
        symptoms: fallbackList,
        source: 'fallback',
        isFallback: true,
        fallbackWarning: `Failed to parse Gemini JSON: ${parseErr?.message}`,
        rawGeminiResponse: rawResponseText,
      });
    }

    const rawList: any[] = Array.isArray(parsed.symptoms)
      ? parsed.symptoms
      : typeof parsed.symptoms === 'string'
      ? parsed.symptoms.split(/[\n,;]+/)
      : [];

    const cleaned = Array.from(
      new Set(
        rawList
          .map((s) => (typeof s === 'string' ? toTitleCase(s) : ''))
          .filter((s) => s.length > 1)
      )
    );

    console.log(`[Extract Symptoms API] Final extracted symptoms (${successfulModel}):`, cleaned);

    return res.status(200).json({
      symptoms: cleaned,
      source: 'gemini',
      isFallback: false,
      modelUsed: successfulModel,
      rawGeminiResponse: rawResponseText,
      durationMs: Date.now() - startTime,
    });
  } catch (error: any) {
    console.error('[Extract Symptoms API] Unexpected top-level error:', error);
    const body = typeof req.body === 'string' ? (tryParse(req.body) || {}) : req.body || {};
    const fallbackList = localExtractSymptoms(body?.text || '');
    return res.status(200).json({
      symptoms: fallbackList,
      source: 'fallback',
      isFallback: true,
      fallbackWarning: `Unexpected error: ${error?.message || error}`,
      geminiError: error?.message,
    });
  }
}

function tryParse(str: string) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}
