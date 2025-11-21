import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req, res) {
  // 1. Gestion des CORS (Autoriser ton site à parler au backend)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Répondre OK aux requêtes de pré-vérification du navigateur
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { base64Audio, mimeType, direction } = req.body;
    const apiKey = process.env.VITE_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Server Error: Missing API Key" });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Logique de langue
    let sourceLang = "French";
    let targetLang = "English";

    switch(direction) {
      case 'FR_EN': sourceLang = "French"; targetLang = "English"; break;
      case 'EN_FR': sourceLang = "English"; targetLang = "French"; break;
      case 'FR_TH': sourceLang = "French"; targetLang = "Thai"; break;
      case 'TH_FR': sourceLang = "Thai"; targetLang = "French"; break;
    }

    // Prompt Système (Marcelo)
    const systemInstruction = `
      You are Marcelo, a friendly and expert language tutor and travel companion. 
      
      Current Task: Translate from ${sourceLang} to ${targetLang}.
      
      1. Listen to the audio which should be in ${sourceLang}.
      2. Transcribe it accurately.
      3. Translate it into natural ${targetLang}.
      4. If the target language is Thai, YOU MUST provide a 'phonetic' transcription using Roman alphabet so a French speaker can read and pronounce it (e.g., 'Sawasdee khrap').
      5. Provide a very brief, helpful tip.
         - **CRITICAL: The tip MUST BE WRITTEN IN FRENCH.** (The user is French).
         - The tip should explain the specificities of the foreign language (English or Thai) (grammar, culture, politeness).
         - Do not give tips about French grammar (the user already speaks French).
         - Example: "En anglais, on utilise 'I would like' pour être plus poli."
      
      If the audio is unclear or not in the expected source language, politely explain that in the 'translatedText' field and set 'sourceText' as "[Inaudible/Wrong Language]".
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: base64Audio } },
          { text: `Transcribe the ${sourceLang} audio and translate to ${targetLang}.` }
        ]
      },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sourceText: { type: Type.STRING },
            translatedText: { type: Type.STRING },
            phonetic: { type: Type.STRING },
            tip: { type: Type.STRING }
          },
          required: ["sourceText", "translatedText", "tip"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response from AI");

    const parsed = JSON.parse(jsonText);
    
    // On renvoie le résultat au Frontend
    res.status(200).json({
      ...parsed,
      sourceLanguage: sourceLang,
      targetLanguage: targetLang
    });

  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}