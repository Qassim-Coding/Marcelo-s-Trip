import { GoogleGenAI, Type, Modality } from "@google/genai";
import { TranslationResult, TranslationDirection } from "../types";

// Initialize Gemini Client
const getAiClient = () => {
  const key = process.env.API_KEY;
  // Check if the key is actually present and looks somewhat valid
  if (!key || key.includes("VITE_API_KEY") || key.length < 10) {
    throw new Error("Clé API manquante ou invalide. Vérifiez les réglages Vercel (Environment Variables).");
  }
  return new GoogleGenAI({ apiKey: key });
};

export const translateAudio = async (
  base64Audio: string, 
  mimeType: string, 
  direction: TranslationDirection
): Promise<TranslationResult> => {
  const ai = getAiClient();
  
  let sourceLang = "French";
  let targetLang = "English";
  
  switch(direction) {
    case 'FR_EN': sourceLang = "French"; targetLang = "English"; break;
    case 'EN_FR': sourceLang = "English"; targetLang = "French"; break;
    case 'FR_TH': sourceLang = "French"; targetLang = "Thai"; break;
    case 'TH_FR': sourceLang = "Thai"; targetLang = "French"; break;
  }

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

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Audio
            }
          },
          {
            text: `Transcribe the ${sourceLang} audio and translate to ${targetLang}.`
          }
        ]
      },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sourceText: { type: Type.STRING, description: `The transcribed ${sourceLang} text` },
            translatedText: { type: Type.STRING, description: `The ${targetLang} translation (Thai Script if target is Thai)` },
            phonetic: { type: Type.STRING, description: "Phonetic pronunciation guide (Required for Thai)" },
            tip: { type: Type.STRING, description: "A helpful learning or cultural tip written in French" }
          },
          required: ["sourceText", "translatedText", "tip"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("Réponse vide de l'IA");
    }

    const parsed = JSON.parse(jsonText);
    return {
        ...parsed,
        sourceLanguage: sourceLang,
        targetLanguage: targetLang
    } as TranslationResult;

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Extract detailed error message if available
    const msg = error.message || "Erreur de connexion API";
    throw new Error(`Erreur IA: ${msg}`);
  }
};

export const speakText = async (text: string): Promise<string> => {
  const ai = getAiClient();
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { 
              voiceName: 'Fenrir' 
            },
          },
        },
      },
    });

    const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!audioData) {
      throw new Error("Pas d'audio généré");
    }
    return audioData;
  } catch (error: any) {
    console.error("TTS API Error:", error);
    throw new Error(`Erreur Vocale: ${error.message}`);
  }
};
