"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const authRotes_1 = __importDefault(require("./routes/authRotes"));
// CARREGAR .env PRIMEIRO
(0, dotenv_1.config)();
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("./config/database"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3333;
// Middleware
app.use('/auth', authRotes_1.default);
app.use(express_1.default.json());
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
        await database_1.default.authenticate();
        console.log('PostgreSQL conectado com sucesso!');
        console.log('Sincronizando modelos...');
        await database_1.default.sync({ force: false });
        console.log('Modelos sincronizados!');
        return true;
    }
    catch (error) {
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
        console.log(`Health check: https://blync.onrender.com/:${PORT}/health`);
    });
};
startServer().catch(console.error);
