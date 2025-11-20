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
app.use('/api/chatbot',ChatbotRoutes)
app.use(cors());
app.use(express.json());

app.get('/health', (req, res )=>{
    res.json({
        status: 'OK',
        messange: 'Servidor FinSync rodando',
        timestamp: new Date().toISOString()
    });
});

app.use('*', (req,res) => {
    res.status(404).json({
        error: 'Rota não encontrada'
    });
});

export default app;
