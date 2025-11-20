import OpenAI from "openai";

export async function startChatbot() {
  console.log("🧠 Inicializando Chatbot...");

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  // teste rápido
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "Você é o chatbot financeiro do FINSYNC." },
      { role: "user", content: "Olá!" }
    ]
  });

  console.log("Chatbot carregado:", response.choices[0].message.content);
}
