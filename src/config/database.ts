import { Sequelize } from 'sequelize-typescript';
import { User } from '../models/user.model';
import { Card } from '../models/cards.model';
import { AccountPayable } from '../models/accountsPayable.model';
import { AccountReceivable } from '../models/accountsReceivable.model';
import { Transaction } from '../models/transaction.model';
import { Wallet } from '../models/wallet.model';

// Configuração simples
const sequelize = new Sequelize({
  database: process.env.DB_NAME || 'BLYNC',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'password',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

// Adicionar modelos manualmente
sequelize.addModels([User, Card, AccountPayable, AccountReceivable, Transaction, Wallet]);

// Sincroniza os models com o banco — cria as tabelas se não existirem
sequelize.sync({ alter: true })
  .then(() => console.log("Tabelas sincronizadas com sucesso!"))
  .catch(err => console.error("Erro ao sincronizar tabelas:", err));

export default sequelize;