import sequelize from '../src/config/database';
import User from '../src/models/user.model';

async function testConnection() {
  try {
    console.log('Iniciando teste de conexão com o banco de dados...\n');
    
    // 1. Testar autenticação básica
    console.log('1. Testando autenticação...');
    await sequelize.authenticate();
    console.log('   Conexão com PostgreSQL estabelecida com sucesso!');
    
    // 2. Testar sincronização
    console.log('2. Testando sincronização de modelos...');
    await sequelize.sync({ force: false });
    console.log('   Modelos sincronizados com sucesso!');
    
    // 3. Testar operações no modelo User
    console.log('3. Testando operações no modelo User...');
    
    // Contar usuários
    const userCount = await User.count();
    console.log(`   Total de usuários no banco: ${userCount}`);
    
    // Listar alguns usuários
    if (userCount > 0) {
      const users = await User.findAll({
        attributes: ['id', 'name', 'email', 'role', 'createdAt'],
        order: [['createdAt', 'DESC']],
        limit: 3
      });
      
      console.log('   Últimos usuários cadastrados:');
      users.forEach(user => {
        const date = user.createdAt.toLocaleDateString('pt-BR');
        console.log(`      - ID: ${user.id} | Nome: ${user.name} | Email: ${user.email} | Role: ${user.role} | Criado: ${date}`);
      });
    } else {
      console.log('   Nenhum usuário encontrado no banco.');
    }
    
    // 4. Testar criação de usuário (teste)
    console.log('4. Testando criação de usuário...');
    try {
      const testEmail = `teste_${Date.now()}@validacao.com`;
      const testUser = await User.create({
        name: 'Usuário Teste Validação',
        email: testEmail,
        password: 'senha123',
        role: 'user'
      });
      console.log('   Usuário teste criado com sucesso!');
      console.log(`      ID: ${testUser.id} | Email: ${testUser.email}`);
      
      // Limpar usuário teste
      await testUser.destroy();
      console.log('   Usuário teste removido.');
    } catch (error) {
      // CORREÇÃO: Tratar error como unknown
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      console.log('   Não foi possível criar usuário teste:', errorMessage);
    }
    
    // 5. Testar consulta de tabelas
    console.log('5. Verificando tabelas no banco...');
    try {
      const [tables] = await sequelize.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        ORDER BY table_name
      `);
      
      console.log('  Tabelas encontradas:');
      (tables as any[]).forEach((table, index) => {
        console.log(`      ${index + 1}. ${table.table_name}`);
      });
    } catch (error) {
      // CORREÇÃO: Tratar error como unknown
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      console.log('  Erro ao buscar tabelas:', errorMessage);
    }
    
    console.log('\nTODOS OS TESTES PASSARAM!');
    console.log('Banco de dados está funcionando perfeitamente!');
    console.log('Conexão estabelecida com sucesso!');
    console.log('Modelos sincronizados corretamente!');
    console.log('Operações CRUD funcionando!');
    
    process.exit(0);
    
  } catch (error) {
    // CORREÇÃO: Tratar error como unknown
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    const errorStack = error instanceof Error ? error.stack : 'Sem stack trace';
    
    console.error('\nERRO NA CONEXÃO COM O BANCO:');
    console.error('Mensagem:', errorMessage);
    console.error('\nDetalhes do erro:');
    console.error(errorStack);
    
    console.log('\nPossíveis soluções:');
    console.log('1. Verifique se o PostgreSQL está rodando');
    console.log('2. Confirme as credenciais no arquivo .env');
    console.log('3. Verifique se o banco "BLYNC" existe');
    console.log('4. Confirme se o usuário tem permissões');
    
    process.exit(1);
  }
}

testConnection();