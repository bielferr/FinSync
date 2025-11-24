import { config } from "dotenv";
// CARREGAR .env PRIMEIRO
config();

import sequelize from './config/database';
import app from './app';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/user.routes';

const PORT = process.env.PORT || 3333;

// Registrar rotas - CORRIGIDO: usar /api prefix para consistência
app.use('/api/auth', authRoutes);
app.use("/api/user", userRoutes);

// Rota de saúde
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'FINSYNC API is running',
    database: process.env.DB_NAME,
    timestamp: new Date().toISOString()
  });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'Bem-vindo à API do FinSync',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/user',
      health: '/health'
    }
  });
});

// const connectDB = async () => {
//   try {
//     console.log('Conectando ao PostgreSQL...');
//     await sequelize.authenticate();
//     console.log('PostgreSQL conectado com sucesso!');
    
//     console.log('Sincronizando modelos...');
//     await sequelize.sync({ force: false });
//     console.log('Modelos sincronizados!');
    
//     return true;
//   } catch (error) {
//     console.error('Erro no banco de dados:', error);
//     return false;
//   }
// };

const connectDB = async () => {
  try {
    console.log('Conectando ao PostgreSQL...');
    await sequelize.authenticate();
    console.log('PostgreSQL conectado com sucesso!');
    
    console.log('Verificando e sincronizando modelos...');
    // Use sync com alter em vez de force para não perder dados
    await sequelize.sync({ alter: true });
    console.log('Modelos verificados e sincronizados!');
    
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
    console.log(`API Base: http://localhost:${PORT}/api`);
  });
};

startServer().catch(console.error);