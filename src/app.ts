import express from "express";
import accountsPayableRoutes from "./routes/accountsPayable.routes";
import accountsReceivableRoutes from "./routes/accountsReceivable.routes";
import investmentsRoutes from "./routes/investments.routes";
 import cardsRoutes from "./routes/cards.routes";
const app = express();
app.use(express.json());

app.use("/api/accounts-payable", accountsPayableRoutes);
app.use("/api/accounts-receivable", accountsReceivableRoutes);
app.use("/api/investments", investmentsRoutes);
 app.use("/api/cards", cardsRoutes);

export default app;
