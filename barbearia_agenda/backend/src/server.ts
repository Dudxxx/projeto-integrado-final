import { app } from './app.js';
import { env } from './config/env.js';
import { pool } from './config/database.js';

const start=async()=>{
    await pool.query('SELECT 1');
    app.listen(env.port,'0.0.0.0',()=>console.log(`API online na porta ${env.port}`));
};
start().catch(error=>{console.error('Falha ao iniciar API',error);process.exit(1);});
