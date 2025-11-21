export enum AppState {
  IDLE = 'IDLE',
  RECORDING = 'RECORDING',
  PROCESSING = 'PROCESSING',
  SPEAKING = 'SPEAKING',
  ERROR = 'ERROR'
}

export type TargetLanguage = 'EN' | 'TH';

export type TranslationDirection = 'FR_EN' | 'EN_FR' | 'FR_TH' | 'TH_FR';

export type ActiveTab = 'TRANSLATE' | 'LEARN';

export interface TranslationResult {
  sourceText: string;
  translatedText: string;
  phonetic?: string; // Pronunciation guide (crucial for Thai)
  tip: string;
  sourceLanguage: string;
  targetLanguage: string;
  audioData?: string; // Base64 audio string for replay
}

export interface HistoryItem extends TranslationResult {
  id: string;
  timestamp: number;
  isFavorite?: boolean;
}

export interface AudioConfig {
  sampleRate: number;
}