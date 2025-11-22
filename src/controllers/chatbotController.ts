import { Request, Response } from 'express';
import { ChatbotService } from '../services/chatbotService';
import { timeStamp } from 'console';

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
          error: 'Erro 400, mensagem não processada.'
        });
        return;
      }

      const response = this.chatbotService.predictCategory(message);

      const blyncResponse = {
        sucess: true,
        data: {
          message: response.response,
          category: response.category,
          confidence: response.confidence,
          quickReplies: this.getQuickReplies(response.category),
          userMessage: message,
          timeStamp: new Date().toISOString,
          userId: userId || 'anonymous',
        }
      };

      res.json(blyncResponse);
    } catch (error) {
      console.error('Error processing message:', error)
      res.status(500).json({
        sucess: false,
        error: 'Erro no servidor'
      });
    }
  }

  private getQuickReplies(category: string): string[] {
    const quickReplies: { [key: string]: string[] } = {
      'SAUDACAO': ['Consultar saldo', 'Ver extrato', 'Pagar conta'],
      'SALDO': ['Ver extrato', 'Fazer transferência', 'Consultar limites'],
      'PIX': ['Fazer PIX', 'Consultar chaves PIX', 'Histórico de PIX'],
      'BOLETO': ['Pagar boleto', 'Código de barras', 'Segunda via'],
      'ATENDENTE': ['Sim, conectar', 'Não, continuar sozinho'],
      'OUTRA': ['Consultar saldo', 'Ajuda', 'Falar com atendente']
    };

    return quickReplies[category] || ['Ajuda','Menu Principal','Falar com atendente'];
  }
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
        message: 'Modelo treinado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao treinar modelo:', error);
      res.status(500).json({
        error: 'Erro no servidor'
      });
    }
  };

  public getHealth = async (req: Request, res: Response): Promise<void> => {
    res.json({
      success: true,
      message: 'Chatbot Blync is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  };

  public getChatHistpry = async (req: Request, res: Response): Promise<void> =>{
    try {
      const { userId } = req.params;

      const chatHistory = [
        {
          id: 1,
          type: 'bot',
          message: 'Bem-vindo(a) ao chat Blync!',
          timestamp: new Date(Date.now() - 300000).toISOString,
        },
        {
          id: 2,
          type: 'bot', 
          message: 'Olá! Como posso te ajudar?',
          timestamp: new Date(Date.now() - 240000).toISOString()
        },
        {
          id: 3,
          type: 'user',
          message: 'Gostaria de saber sobre meu saldo',
          timestamp: new Date(Date.now() - 180000).toISOString()
        },
        {
          id: 4,
          type: 'bot',
          message: 'Claro! Seu saldo atual é de R$ 5.243,87. Posso ajudar com mais alguma coisa?',
          timestamp: new Date(Date.now() - 120000).toISOString(),
          quickReplies: ['Consultar saldo', 'Ver extrato', 'Pagar conta']
        }
      ];
      res.json({
        success: true,
        data: {
          userId: userId || 'anonymous',
          chatHistory,
          userInfo: {
            name: 'João Silva',
            accountNumber: '12345-6',
            balance: 5243.87
          }
        }
      });
    } catch (error) {
      console.error('Error getting chat history:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  };
}