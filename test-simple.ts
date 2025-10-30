import { config } from "dotenv";
config();

console.log('Teste básico funcionando');
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_HOST:', process.env.DB_HOST);