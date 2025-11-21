import { GoogleGenAI, Type, Modality } from "@google/genai";
import { TranslationResult, TranslationDirection } from "../types";

// Initialize Gemini Client
// Note: Ensure process.env.API_KEY is set in your environment
const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

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
    throw new Error("No response from Gemini");
  }

  try {
    const parsed = JSON.parse(jsonText);
    return {
        ...parsed,
        sourceLanguage: sourceLang,
        targetLanguage: targetLang
    } as TranslationResult;
  } catch (e) {
    console.error("Failed to parse JSON", e);
    throw new Error("Failed to parse translation response");
  }
};

export const speakText = async (text: string): Promise<string> => {
  const ai = getAiClient();
  
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
    throw new Error("No audio data generated");
  }
  return audioData;
};