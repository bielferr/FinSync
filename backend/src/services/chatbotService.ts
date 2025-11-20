import * as natural from 'natural';

export interface TrainingData {
  phrases: string[];
  categories: string[];
}

export interface ChatbotResponse {
  category: string;
  confidence: number;
  response?: string;
}

export class ChatbotService {
  private classifier: natural.BayesClassifier;
  private responses: Map<string, string[]>;

  constructor() {
    this.classifier = new natural.BayesClassifier();
    this.responses = new Map();
    this.initializeResponses();
  }

  private initializeResponses(): void {
    // Configuração das respostas para cada categoria
    this.responses.set('SAUDACAO', [
      'Olá! Como posso ajudá-lo hoje?',
      'Oi! Em que posso ser útil?',
      'Olá! Estou aqui para ajudar.'
    ]);

    this.responses.set('SALDO', [
      'Para consultar seu saldo, acesse a seção "Minha Conta" no aplicativo.',
      'Você pode verificar seu saldo na página inicial do app.',
      'O saldo está disponível no menu principal.'
    ]);

    this.responses.set('PIX', [
      'Para fazer um PIX, vá em "Transferências" > "PIX".',
      'Você pode realizar PIX através do menu de pagamentos.',
      'A função PIX está disponível na aba de transferências.'
    ]);

    this.responses.set('BOLETO', [
      'Para pagar um boleto, acesse "Pagamentos" > "Boleto".',
      'Você pode pagar boletos na seção de pagamentos.',
      'Boletos são processados através do menu de faturas.'
    ]);

    this.responses.set('ATENDENTE', [
      'Conectando você com um atendente...',
      'Um momento, vou transferir para nosso time especializado.',
      'Redirecionando para atendimento humano.'
    ]);

    this.responses.set('OUTRA', [
      'Não entendi completamente. Pode reformular?',
      'Poderia explicar de outra forma?',
      'Não tenho informações sobre isso no momento.'
    ]);
  }

  public trainModel(trainingData: TrainingData): void {
    // Limpar classificador anterior
    this.classifier = new natural.BayesClassifier();

    // Treinar com novos dados
    trainingData.phrases.forEach((phrase, index) => {
      this.classifier.addDocument(phrase, trainingData.categories[index]);
    });

    this.classifier.train();
  }

  public predictCategory(message: string): ChatbotResponse {
    const classifications = this.classifier.getClassifications(message);
    const bestMatch = classifications[0];

    return {
      category: bestMatch.label,
      confidence: bestMatch.value,
      response: this.getResponse(bestMatch.label)
    };
  }

  private getResponse(category: string): string {
    const categoryResponses = this.responses.get(category) || this.responses.get('OUTRA')!;
    const randomIndex = Math.floor(Math.random() * categoryResponses.length);
    return categoryResponses[randomIndex];
  }

  public initializeWithDefaultData(): void {
    const defaultTrainingData: TrainingData = {
      phrases: [
        "Oi, tudo bem?",
        "Bom dia!",
        "Qual o saldo da minha conta?",
        "Boa tarde",
        "Quero falar com um atendente",
        "Olá, como vai?",
        "Me ajuda com o boleto",
        "Até logo",
        "Boa noite",
        "Como faço um pix?",
        "Saldo da conta",
        "Ver meu saldo",
        "Consultar saldo",
        "Fazer um pix",
        "Transferência pix",
        "Pagar boleto",
        "Boleto bancário",
        "Falar com humano",
        "Atendimento humano",
        "Ajuda humana"
      ],
      categories: [
        "SAUDACAO", "SAUDACAO", "SALDO", "SAUDACAO", "ATENDENTE",
        "SAUDACAO", "BOLETO", "SAUDACAO", "SAUDACAO", "PIX",
        "SALDO", "SALDO", "SALDO", "PIX", "PIX",
        "BOLETO", "BOLETO", "ATENDENTE", "ATENDENTE", "ATENDENTE"
      ]
    };

    this.trainModel(defaultTrainingData);
  }
}