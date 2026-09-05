import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

function cleanJsonText(raw: string): string {
  let text = (raw || '').trim();
  // Strip markdown code fences (```json ... ``` or ``` ... ```)
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  }
  // Extract substring between first '{' and last '}'
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace >= firstBrace) {
    text = text.substring(firstBrace, lastBrace + 1);
  }
  return text.trim();
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Lazy or safe init for Gemini client
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

  // Health endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // Symptom extraction endpoint powered by Gemini API
  app.post('/api/extract-symptoms', async (req, res) => {
    try {
      const { text, language } = req.body;
      if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: 'Text is required', symptoms: [] });
      }

      const ai = getAi();
      if (!ai) {
        console.warn('GEMINI_API_KEY not configured. Falling back to local symptom extraction.');
        return res.json({ symptoms: localExtractSymptoms(text) });
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

      return res.json({ symptoms: cleaned });
    } catch (err: any) {
      console.error('Error in /api/extract-symptoms:', err);
      return res.json({ symptoms: localExtractSymptoms(req.body?.text || '') });
    }
  });

  // Multimodal Medical Document OCR extraction powered by Gemini API
  app.post('/api/ocr-document', async (req, res) => {
    try {
      const { image, mimeType } = req.body;
      if (!image || typeof image !== 'string') {
        return res.status(400).json({
          error: 'Image data is required',
          patientName: null,
          date: null,
          medications: [],
        });
      }

      const ai = getAi();
      if (!ai) {
        const errorMsg = 'GEMINI_API_KEY environment variable is not configured on the server.';
        console.warn(`[OCR Server] ${errorMsg}`);
        return res.status(500).json({
          error: errorMsg,
          patientName: null,
          date: null,
          medications: [],
        });
      }

      let base64Data = image;
      let detectedMimeType = mimeType || 'image/jpeg';
      if (image.startsWith('data:')) {
        const commaIdx = image.indexOf(',');
        if (commaIdx !== -1) {
          const meta = image.substring(0, commaIdx);
          const mimeMatch = meta.match(/data:([^;]+)/);
          if (mimeMatch && mimeMatch[1]) {
            detectedMimeType = mimeMatch[1];
          }
          base64Data = image.substring(commaIdx + 1);
        }
      }
      // Strip newlines/whitespace
      base64Data = base64Data.replace(/[\r\n\s]+/g, '');

      console.log(`[OCR Server] Processing image: mimeType=${detectedMimeType}, base64Length=${base64Data.length}`);

      const prompt = `You are an expert medical document OCR and clinical intake extraction assistant for a hospital clinic.
Analyze this medical document image (prescription, clinical note, doctor slip, lab report, or discharge summary).

Carefully read and extract the following fields into structured JSON, being STRICT and PRECISE about separating patient symptoms/complaints from pharmaceutical medications:

1. "patientName": The patient's full name if clearly written or printed on the document. If not visible, unclear, cut off, or illegible, return null.
2. "dateOfBirth": The patient's date of birth or consultation/prescription date if clearly written or printed. If not visible or unclear, return null.
3. "symptoms": An array of strings capturing anything describing what the patient is experiencing, bodily complaints, or reasons for visit (e.g. "Fever", "Headache", "Cough", "Eye pain", "Nausea", "Joint pain").
   - Do NOT include pharmaceutical drug or medicine names in this field.
   - If the document has a section literally labeled "Symptoms", "Complaints", or "Chief Complaints", place items from that section into this field.
4. "medications": An array of strings containing ONLY actual drug/medicine names (e.g. Paracetamol, Amoxicillin, Ibuprofen, Cetirizine) along with their dosage and frequency if visible (e.g. "Paracetamol 1 tablet, morning after breakfast", "Amoxicillin 500mg tid").
   - STRICT RULE: Do NOT include symptoms, clinical diagnoses, or complaints (like "Fever" or "Headache") in this medications field.
   - If the document has a section literally labeled "Medications", "Rx", "Treatment", or "Prescription", place items from that section directly into this field.
   - If a word appears ambiguous, default to the medications field only if it matches a recognizable pharmaceutical medicine name or pattern (e.g. ends in common drug suffixes like -cillin, -mol, -zole, -statin, -prag, -mycin, -dipine, or is a well known OTC/prescription drug name).

CRITICAL EXTRACTION RULES:
- Do NOT guess or hallucinate.
- If a field is not present or handwriting is too unclear or ambiguous to be certain, return null (or [] for symptoms / medications).
- Never return placeholder dummy data. Only return what is genuinely readable in the image.

Return ONLY a JSON object in this exact format:
{
  "patientName": "Full Patient Name or null",
  "dateOfBirth": "DOB or consultation date or null",
  "symptoms": ["Fever", "Headache"],
  "medications": ["Paracetamol 1 tablet, morning after breakfast"]
}`;

      const imagePart = {
        inlineData: {
          mimeType: detectedMimeType,
          data: base64Data,
        },
      };

      const textPart = {
        text: prompt,
      };

      // Try reliable multimodal models with fallback
      const modelsToTry = ['gemini-2.5-flash', 'gemini-3.8-flash', 'gemini-flash-latest'];
      let lastModelError: any = null;
      let rawResponseText = '';
      let successfulModel = '';

      for (const model of modelsToTry) {
        try {
          console.log(`[OCR Server] Invoking Gemini model: ${model}...`);
          const response = await ai.models.generateContent({
            model,
            contents: [imagePart, textPart],
            config: {
              responseMimeType: 'application/json',
            },
          });
          rawResponseText = response.text?.trim() || '';
          successfulModel = model;
          console.log(`[OCR Server] Success with model: ${model}`);
          console.log(`[OCR Server] Raw Gemini response:\n${rawResponseText}`);
          break;
        } catch (mErr: any) {
          console.warn(`[OCR Server] Model ${model} failed:`, mErr?.message || mErr);
          lastModelError = mErr;
        }
      }

      if (!rawResponseText && lastModelError) {
        console.error('[OCR Server] All Gemini models failed. Last error:', lastModelError);
        return res.status(503).json({
          error: `Gemini API error: ${lastModelError.message || 'Models unavailable'}`,
          patientName: null,
          dateOfBirth: null,
          date: null,
          symptoms: [],
          medications: [],
        });
      }

      // Strip any markdown code fences before parsing
      const cleanedJson = cleanJsonText(rawResponseText);
      console.log(`[OCR Server] Cleaned JSON for parsing:\n${cleanedJson}`);

      let parsed: any = {};
      try {
        parsed = JSON.parse(cleanedJson);
      } catch (parseErr: any) {
        console.error('[OCR Server] JSON.parse failed on cleaned text:', parseErr?.message);
        console.error('[OCR Server] Raw response was:', rawResponseText);
        return res.status(500).json({
          error: `Failed to parse Gemini response as JSON: ${parseErr?.message}`,
          rawResponse: rawResponseText,
          patientName: null,
          dateOfBirth: null,
          date: null,
          symptoms: [],
          medications: [],
        });
      }

      console.log('[OCR Server] Successfully parsed OCR data:', parsed);

      const patientName =
        typeof parsed.patientName === 'string' && parsed.patientName.trim().length > 0
          ? parsed.patientName.trim()
          : null;

      const dateOfBirth =
        typeof parsed.dateOfBirth === 'string' && parsed.dateOfBirth.trim().length > 0
          ? parsed.dateOfBirth.trim()
          : (typeof parsed.date === 'string' && parsed.date.trim().length > 0 ? parsed.date.trim() : null);

      let symptoms: string[] = [];
      if (Array.isArray(parsed.symptoms)) {
        symptoms = parsed.symptoms
          .map((s: any) => (typeof s === 'string' ? s.trim() : ''))
          .filter((s: string) => s.length > 0);
      } else if (typeof parsed.symptoms === 'string' && parsed.symptoms.trim().length > 0) {
        symptoms = parsed.symptoms
          .split(/[\n,;]+/)
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 0);
      }

      let medications: string[] = [];
      if (Array.isArray(parsed.medications)) {
        medications = parsed.medications
          .map((m: any) => (typeof m === 'string' ? m.trim() : ''))
          .filter((m: string) => m.length > 0);
      } else if (typeof parsed.medications === 'string' && parsed.medications.trim().length > 0) {
        medications = parsed.medications
          .split(/[\n,;]+/)
          .map((m: string) => m.trim())
          .filter((m: string) => m.length > 0);
      }

      return res.json({
        patientName,
        dateOfBirth,
        date: dateOfBirth, // backwards compatibility
        symptoms,
        medications,
        rawGeminiResponse: rawResponseText,
        modelUsed: successfulModel,
      });
    } catch (err: any) {
      console.error('[OCR Server] Unexpected error in /api/ocr-document:', err);
      return res.status(500).json({
        error: err?.message || 'Failed to process document with OCR',
        patientName: null,
        date: null,
        medications: [],
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
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

startServer();
