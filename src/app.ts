import express, { Application, Request, Response } from "express";

const app: Application = express();

// Para aceitar JSON no corpo das requisições
app.use(express.json());

// Rota de teste
app.get("/", (req: Request, res: Response) => {
res.send("🚀 Server rodando com sucesso!");
});

export default app;
