import { GoogleGenAI, Type } from '@google/genai';

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

function localExtractSymptoms(text: string): string[] {
  if (!text) return [];
  const knownSymptoms = [
    'fever', 'cough', 'fatigue', 'headache', 'sore throat', 'chest congestion',
    'joint pain', 'stomach ache', 'nausea', 'shortness of breath', 'eye pain',
    'body ache', 'vomiting', 'dizziness', 'chills', 'runny nose', 'back pain',
    'ear pain', 'rash', 'weakness', 'cold', 'diarrhea', 'constipation',
    'swelling', 'chest pain', 'loss of appetite'
  ];
  const lower = text.toLowerCase();
  return knownSymptoms.filter((s) => lower.includes(s));
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { text, language } = body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required', symptoms: [] });
    }

    const ai = getAi();
    if (!ai) {
      console.warn('GEMINI_API_KEY not configured. Falling back to local symptom extraction.');
      return res.status(200).json({ symptoms: localExtractSymptoms(text) });
    }

    const prompt = `You are an AI clinical intake assistant for an Indian hospital/clinic.
A patient has provided the following statement describing their condition or symptoms:
"${text}"
Input language: ${language || 'en'}.

Extract ALL symptoms, medical complaints, bodily discomforts, and clinical issues mentioned in this statement.
Include both common symptoms (like fever, cough, fatigue, headache, nausea) and specific or uncommon symptoms (such as eye pain, chest burning, dizziness, knee swelling, chills, body ache, blurred vision, etc.).
Normalize each symptom into a concise, clear lowercase phrase (e.g. "eye pain", "fever", "cough", "fatigue", "dizziness").
If no symptoms or medical complaints are mentioned (for example if the user is only greeting, confirming name, or saying no symptoms), return an empty array for symptoms.
Return a structured JSON object with the property "symptoms" containing an array of strings.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            symptoms: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
              description: "List of all clinical symptoms extracted from the patient statement",
            },
          },
          required: ['symptoms'],
        },
      },
    });

    const responseText = response.text?.trim() || '{}';
    let parsed: { symptoms?: string[] } = {};
    try {
      parsed = JSON.parse(responseText);
    } catch {
      parsed = { symptoms: localExtractSymptoms(text) };
    }

    const rawList = Array.isArray(parsed.symptoms) ? parsed.symptoms : [];
    const cleaned = Array.from(
      new Set(
        rawList
          .map((s) => s.trim().toLowerCase())
          .filter((s) => s.length > 1)
      )
    );

    return res.status(200).json({ symptoms: cleaned });
  } catch (error: any) {
    console.error('Error in /api/extract-symptoms:', error);
    const body = typeof req.body === 'string' ? (tryParse(req.body) || {}) : req.body || {};
    return res.status(200).json({ symptoms: localExtractSymptoms(body?.text || '') });
  }
}

function tryParse(str: string) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}
