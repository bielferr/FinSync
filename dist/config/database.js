"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const user_model_1 = require("../models/user.model");
const cards_model_1 = require("../models/cards.model");
const accountsPayable_model_1 = require("../models/accountsPayable.model");
const accountsReceivable_model_1 = require("../models/accountsReceivable.model");
const transaction_model_1 = require("../models/transaction.model");
const wallet_model_1 = require("../models/wallet.model");
// Configuração simples
const sequelize = new sequelize_typescript_1.Sequelize({
    database: process.env.DB_NAME || 'BLYNC',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'password',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
});
// Adicionar modelos manualmente
sequelize.addModels([user_model_1.User, cards_model_1.Card, accountsPayable_model_1.AccountPayable, accountsReceivable_model_1.AccountReceivable, transaction_model_1.Transaction, wallet_model_1.Wallet]);
exports.default = sequelize;
