import { TranslationResult, TranslationDirection } from "../types";

// NOTE: On n'importe plus GoogleGenAI ici car tout se passe côté serveur (api/ folder)

export const translateAudio = async (
  base64Audio: string, 
  mimeType: string, 
  direction: TranslationDirection
): Promise<TranslationResult> => {
  
  // On appelle NOTRE backend Vercel (/api/translate)
  const response = await fetch('/api/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      base64Audio,
      mimeType,
      direction
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `Erreur serveur: ${response.status}`);
  }

  const result = await response.json();
  return result as TranslationResult;
};

export const speakText = async (text: string): Promise<string> => {
  
  // On appelle NOTRE backend Vercel (/api/speak)
  const response = await fetch('/api/speak', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Erreur lors de la synthèse vocale");
  }

  const data = await response.json();
  return data.audioData;
};
