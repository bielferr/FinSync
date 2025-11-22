import { ChatbotService } from './services/chatbotService';

async function testChatbot() {
  const chatbot = new ChatbotService();
  chatbot.initializeWithDefaultData();

  const testMessages = [
    "Oi, bom dia!",
    "Qual meu saldo?",
    "Como faço um pix?",
    "Quero pagar um boleto",
    "Preciso falar com alguém"
  ];

  for (const message of testMessages) {
    const response = chatbot.predictCategory(message);
    console.log(`Mensagem: "${message}"`);
    console.log(`Categoria: ${response.category}`);
    console.log(`Confiança: ${response.confidence}`);
    console.log(`Resposta: ${response.response}`);
    console.log('---');
  }
}

testChatbot();