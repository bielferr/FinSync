import express from 'express';
import {connectDB, sequelize} from './database/config'
import './models/Usuario';
import './models/Conta';
import './models/Categoria';
import './models/Transacao';
import { config } from "dotenv";

const app =express();
app.use(express.json());

const PORT = process.env.PORT || 3333;

connectDB();

config();

sequelize.sync({alter: true})
  .then(() => console.log('tabelas sicronizadas'))
  .catch(err => console.error('erro ao sincronizar',err));

app.listen(300, () => console.log('servidor rodando em http://localhost:3000'))  

//app.listen(PORT, () => {
//  console.log(` Server running on http://localhost:${PORT}`);
//});




// npm intall -D typescript ts-node-dev @types/node
// npm start