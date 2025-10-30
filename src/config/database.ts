import { Sequelize } from 'sequelize-typescript';
import { User } from '../models/user.model';

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
sequelize.addModels([User]);

export default sequelize;