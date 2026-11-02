import 'dotenv/config';
import express, { ErrorRequestHandler } from 'express';
import cors from 'cors';
import { sequelize } from './config/database';
import './models/UserModel';
import { usersRouter } from './routes/users';
import { ApiError } from './services/UserService';

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:5173' }));
app.use(express.json({ limit: '20kb' }));
app.use('/api/usuarios', usersRouter);
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ApiError) { res.status(error.status).json({ message: error.message }); return; }
  if (error instanceof SyntaxError && 'body' in error) { res.status(400).json({ message: 'JSON inválido.' }); return; }
  console.error(error);
  res.status(500).json({ message: 'Erro interno do servidor.' });
};
app.use(errorHandler);

async function iniciar() {
  await sequelize.authenticate();
  // Adequado a ambiente acadêmico. Em produção, usar migrations.
  await sequelize.sync();
  app.listen(Number(process.env.PORT ?? 3001), () => console.log('API disponível na porta ' + (process.env.PORT ?? 3001)));
}
iniciar().catch(error => { console.error('Falha ao iniciar:', error); process.exit(1); });
