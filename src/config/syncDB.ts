// src/config/syncDatabase.ts
import sequelize from './database';
import { User } from '../models/user.model';

export const syncDatabase = async () => {
  try {
    console.log('Sincronizando banco de dados...');
    
    // Force sync - CUIDADO: isso vai dropar e recriar as tabelas
    await sequelize.sync({ force: true });
    
    console.log('Banco de dados sincronizado com sucesso!');
    
    // Opcional: Criar um usuário admin padrão
    await User.create({
      name: 'Admin',
      email: 'admin@finsync.com',
      password: 'admin123',
      role: 'admin'
    });
    
    console.log('Usuário admin criado!');
    
  } catch (error) {
    console.error('Erro ao sincronizar banco de dados:', error);
  }
};

// Execute se chamado diretamente
if (require.main === module) {
  syncDatabase();
}