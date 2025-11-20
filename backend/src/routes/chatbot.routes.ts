import express, { Request, Response } from "express";
import fetch from "node-fetch";
import app from '../app';


interface OpenAIChatResponse {
  choices: {
    message: { content: string };
  }[];
}

app.post("/chatbot", async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Mensagem é obrigatória." });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Você é um assistente financeiro inteligente do aplicativo FINSYNC." },
          { role: "user", content: message }
        ],
      }),
    });

    const data = (await response.json()) as OpenAIChatResponse;

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ error: "Erro ao processar resposta da IA." });
    }

    return res.json({
      success: true,
      response: data.choices[0].message.content
    });

  } catch (error) {
    console.error("Erro no chatbot:", error);
    return res.status(500).json({ error: "Erro interno no chatbot." });
  }
});
