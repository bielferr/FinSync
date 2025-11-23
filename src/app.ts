import express from "express";
import accountsPayableRoutes from "./routes/accountsPayable.routes";
import accountsReceivableRoutes from "./routes/accountsReceivable.routes";
import cardsRoutes from "./routes/cards.routes";
import walletRoutes from "./routes/wallet.routes";
import transactionsRoutes from "./routes/transactions.routes";
import userRoutes from "./routes/user.routes";
import matrizRoutes from "./routes/matriz.routes";
import authRoutes from "./routes/authRotes";
import ChatbotRoutes from './routes/chatbotRoutes'
import cors from 'cors';
import path from 'path';
import { timeStamp } from "console";

const app = express();
app.use(express.json());

app.use("/api/accounts-payable", accountsPayableRoutes);
app.use("/api/accounts-receivable", accountsReceivableRoutes);
app.use("/api/cards", cardsRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/user", userRoutes);
app.use("/api/matriz", matrizRoutes);
app.use("/api/transactions", transactionsRoutes);
app.use("/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use('/api/chatbot',ChatbotRoutes);
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'))
});

//chatbotRoutes
app.get('/suporte', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/suporte.html'))
});

//curl ...
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        messange: 'Servidor FinSync rodando',
        timestamp: new Date().toISOString()
    });
});

//accountsPayable.routes
app.get('/saidas', (req, res) => {
    res.json({
        status: 'OK',
        messange: 'saida',
        timestamp: new Date().toISOString()
    });
});

//accountsReceivable.routes
app.get('/entradas', (req, res) => {
    res.json({
        status: 'OK',
        messange: 'entrada',
        timestamp: new Date().toISOString()
    });
});

//auth.routes
app.get('/autenticacao', (req, res) => {
    res.json({
        status: 'OK',
        messange: 'autenticacao',
        timestamp: new Date().toISOString()
    });
});

//cards.routes
app.get('/cartoes', (req, res) => {
    res.json({
        status: 'OK',
        messange: 'cartoes',
        timestamp: new Date().toISOString()
    });
});

//matriz.routes
app.get('/matriz', (req, res) => {
    res.json({
        status: 'OK',
        messange: 'matriz',
        timestamp: new Date().toISOString()
    });
});

//transaction.routes
app.get('/transacoes', (req, res) => {
    res.json({
        status: 'OK',
        messange: 'transacoes',
        timestamp: new Date().toISOString()
    });
});

//user.routes
app.get('/perfil', (req, res) => {
    res.json({
        status: 'OK',
        messange: 'perfil',
        timestamp: new Date().toISOString()
    });
});

//wallet.routes
app.get('/carteira', (req, res) => {
    res.json({
        status: 'OK',
        messange: 'Servidor FinSync rodando',
        timestamp: new Date().toISOString()
    });
});

//rotas based on frontend (VHS)
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

app.use((req,res) => {
    res.status(404).json({
        error: 'Rota não encontrada',
        path: req.path,
        method: req.method
    });
});

export default app;
