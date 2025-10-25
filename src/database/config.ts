import { Sequelize } from 'sequelize-typescript';
import { Usuario } from '../models/Usuario';
import { Conta } from '../models/Conta';
import { Categoria } from '../models/Categoria';
import { Transacao } from '../models/Transacao';

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'BLYNC',
  password: 'password',
  database: 'BLYNC',
  models: [Usuario,Conta,Categoria,Transacao],
  logging: false
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('conectado');
  } catch (error) {
    console.error('não conectado:', error);
  }
};
