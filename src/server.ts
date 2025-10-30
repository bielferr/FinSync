import { config } from "dotenv";
// CARREGAR .env PRIMEIRO
config();

import express from 'express';
import sequelize from './config/database';

const app = express();
const PORT = process.env.PORT || 3333;

// Middleware
app.use(express.json());

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
  
  app.listen(PORT, () => {
    console.log(`Servidor FINSYNC rodando na porta ${PORT}`);
    console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Banco de dados: ${process.env.DB_NAME}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
  });
};

startServer().catch(console.error);