export interface ChatMessage {
  id: string;
  message: string;
  category: string;
  confidence: number;
  response: string;
  timestamp: Date;
  userId?: string;
}

export interface TrainingSession {
  id: string;
  phrasesCount: number;
  categories: string[];
  accuracy?: number;
  timestamp: Date;
}