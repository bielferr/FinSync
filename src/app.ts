import express from "express";
import accountsPayableRoutes from "./routes/accountsPayable.routes";
import accountsReceivableRoutes from "./routes/accountsReceivable.routes";
import investmentsRoutes from "./routes/investments.routes";
 import cardsRoutes from "./routes/cards.routes";
 import walletRoutes from "./routes/wallet.routes";
 import userRoutes from "./routes/user.routes";
 import matrizRoutes from "./routes/matriz.routes";
const app = express();
app.use(express.json());

app.use("/api/accounts-payable", accountsPayableRoutes);
app.use("/api/accounts-receivable", accountsReceivableRoutes);
app.use("/api/investments", investmentsRoutes);
 app.use("/api/cards", cardsRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/user", userRoutes);
app.use("/api/matriz", matrizRoutes);

export default app;
