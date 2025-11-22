import { Request, Response } from 'express';
import { ChatbotService } from '../services/chatbotService';

export class ChatbotController {
  private chatbotService: ChatbotService;

  constructor() {
    this.chatbotService = new ChatbotService();
    this.chatbotService.initializeWithDefaultData();
  }

  public processMessage = async (req: Request, res: Response): Promise<void> => {
    try {
      const { message } = req.body;

      if (!message) {
        res.status(400).json({
          error: 'Message is required'
        });
        return;
      }

      const response = this.chatbotService.predictCategory(message);

      res.json({
        success: true,
        data: response
      });
    } catch (error) {
      console.error('Error processing message:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  };

  public trainModel = async (req: Request, res: Response): Promise<void> => {
    try {
      const { phrases, categories } = req.body;

      if (!phrases || !categories || phrases.length !== categories.length) {
        res.status(400).json({
          error: 'Phrases and categories arrays are required and must have the same length'
        });
        return;
      }

      this.chatbotService.trainModel({ phrases, categories });

      res.json({
        success: true,
        message: 'Model trained successfully'
      });
    } catch (error) {
      console.error('Error training model:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  };

  public getHealth = async (req: Request, res: Response): Promise<void> => {
    res.json({
      success: true,
      message: 'Chatbot service is running',
      timestamp: new Date().toISOString()
    });
  };
}