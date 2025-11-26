import express from "express";
import accountsPayableRoutes from "./routes/accountsPayable.routes";
import accountsReceivableRoutes from "./routes/accountsReceivable.routes";
import cardsRoutes from "./routes/cards.routes";
import walletRoutes from "./routes/wallet.routes";
import transactionsRoutes from "./routes/transactions.routes";
import userRoutes from "./routes/user.routes";
import matrizRoutes from "./routes/matriz.routes";
import authRoutes from "./routes/authRoutes";
import ChatbotRoutes from './routes/chatbotRoutes'
import cors from 'cors';
import path from 'path';

const app = express();

app.use((req, res, next) => {
  console.log(`📍 [${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')))

app.use("/api/accounts-payable", accountsPayableRoutes);
app.use("/api/accounts-receivable", accountsReceivableRoutes);
app.use("/api/cards", cardsRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/user", userRoutes);
app.use("/api/matriz", matrizRoutes);
app.use("/api/transactions", transactionsRoutes);
app.use("/api/auth", authRoutes); 
app.use("/api/users", userRoutes);
app.use('/api/chatbot', ChatbotRoutes);

// ROTA PARA TESTE
import { AuthController } from './controllers/authController';
const authController = new AuthController();

app.post('/api/auth/register-direct', authController.register);
console.log('✅ Rota direta /api/auth/register-direct registrada');

console.log('Registrando rota /api/auth');
app.use("/api/auth", authRoutes);
console.log('Rota /api/auth registrada');

app.use("/api/users", userRoutes);
app.use('/api/chatbot', ChatbotRoutes)

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'))
});

app.get('/suporte', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/suporte.html'))
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/sobre.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/contato.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/cadastro.html'));
});

app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Servidor FinSync rodando', 
        timestamp: new Date().toISOString()
    });
});

app.get('/saidas', (req, res) => {
    res.json({
        status: 'OK',
        message: 'saida',
        timestamp: new Date().toISOString()
    });
});

app.get('/entradas', (req, res) => {
    res.json({
        status: 'OK',
        message: 'entrada',
        timestamp: new Date().toISOString()
    });
});

app.get('/autenticacao', (req, res) => {
    res.json({
        status: 'OK',
        message: 'autenticacao',
        timestamp: new Date().toISOString()
    });
});

app.get('/cartoes', (req, res) => {
    res.json({
        status: 'OK',
        message: 'cartoes',
        timestamp: new Date().toISOString()
    });
});

app.get('/matriz', (req, res) => {
    res.json({
        status: 'OK',
        message: 'matriz',
        timestamp: new Date().toISOString()
    });
});

app.get('/transacoes', (req, res) => {
    res.json({
        status: 'OK',
        message: 'transacoes',
        timestamp: new Date().toISOString()
    });
});

app.get('/perfil', (req, res) => {
    res.json({
        status: 'OK',
        message: 'perfil',
        timestamp: new Date().toISOString()
    });
});

app.get('/carteira', (req, res) => {
    res.json({
        status: 'OK',
        message: 'carteira',
        timestamp: new Date().toISOString()
    });
});

app.use((req, res) => {
    res.status(404).json({
        error: 'Sucesso',
        path: req.path,
        method: req.method
    });
});

export default app;