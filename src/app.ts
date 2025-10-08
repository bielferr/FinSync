import express from "express";
import accountsPayableRoutes from "./routes/accountsPayable.routes";

const app = express();


app.use(express.json());


app.use("/api/accounts-payable", accountsPayableRoutes);

export default app;
