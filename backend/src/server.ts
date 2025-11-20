import { startChatbot } from "./services/chatbot"
import { config } from "dotenv";
config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import sequelize from './config/database';
import app from './app';
import authRoutes from './routes/authRotes';
import userRoutes from './routes/user.routes';


const PORT = process.env.PORT || 3333;

// Registrar rotas que não estão em `app.ts`
app.use('/auth', authRoutes);
app.use("/user", userRoutes);

// Interface para retorno do ChatGPT
interface OpenAIChatResponse {
  choices: {
    message: { content: string }
  }[];
}

// Rota de saúde
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'FINSYNC API is running',
    database: process.env.DB_NAME,
    timestamp: new Date().toISOString()
  });
});

const connectDB = async () => {
  try {
    console.log('Conectando ao PostgreSQL...');
    await sequelize.authenticate();
    console.log('PostgreSQL conectado com sucesso!');
    
    console.log('Sincronizando modelos...');
    await sequelize.sync({ force: false });
    console.log('Modelos sincronizados!');
    
    return true;
  } catch (error) {
    console.error('Erro no banco de dados:', error);
    return false;
  }
};

// iniciar servidor
const startServer = async () => {
  const dbConnected = await connectDB();
  
  if (!dbConnected) {
    console.log('Servidor iniciando sem conexão com banco de dados');
  }
  
  startChatbot().catch(err=>{
    console.error("Erro ao iniciar o Chatbot", err)
  });

  app.listen(PORT, () => {
    console.log(`Servidor FINSYNC rodando na porta ${PORT}`);
    console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Banco de dados: ${process.env.DB_NAME}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Chatbot: POST http://localhost:${PORT}/chatbot`);
  });
};

startServer().catch(console.error);
