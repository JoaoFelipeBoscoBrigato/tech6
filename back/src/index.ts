import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import sequelize from './config/database'; // Instância do Sequelize
import userRoutes from './routes/userRoutes';
import eventsRoutes from './routes/EventsRoutes';
import SignatureRouter from './routes/SignatureRoutes';
import RegistrationRouter from './routes/ResgistrationRoutes';
import path from 'path';

const cors = require('cors');
const app = express();
const port = parseInt(process.env.PORT || '3000');

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:4173',
      'http://localhost:80',
      'http://localhost',
      'https://meuapp.local',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

app.use(express.json());
// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Log das rotas sendo registradas
console.log('🔧 Registrando rotas...');

app.use('/api/users', userRoutes);
console.log('✅ Rotas de usuários registradas em /api/users');

app.use('/api/events', eventsRoutes);
console.log('✅ Rotas de eventos registradas em /api/events');

app.use('/api/signatures', SignatureRouter);
console.log('✅ Rotas de assinaturas registradas em /api/signatures');

app.use('/api/registrations', RegistrationRouter);
console.log('✅ Rotas de registros registradas em /api/registrations');

// Rota de teste para verificar se o servidor está funcionando
app.get('/test', (req, res) => {
  res.json({
    message: 'Servidor funcionando!',
    timestamp: new Date().toISOString(),
  });
});

// Rota de teste para API
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API funcionando!',
    timestamp: new Date().toISOString(),
  });
});

// Rota de teste para usuários
app.get('/api/users/test', (req, res) => {
  res.json({
    message: 'Rota de usuários funcionando!',
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'API está online!',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// Database connection and sync
const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');

    await sequelize.sync({ alter: true });
    console.log('✅ Sincronização do banco de dados concluída!');
  } catch (error) {
    console.error('❌ Erro na conexão com o banco de dados:', error);
    process.exit(1);
  }
};

// Initialize database and start server
initializeDatabase().then(() => {
  app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando na porta ${port}`);
    console.log(`📊 Health check: http://localhost:${port}/health`);
    console.log(`🧪 Test route: http://localhost:${port}/test`);
    console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log('📋 Rotas disponíveis:');
    console.log('  - POST /api/users/login');
    console.log('  - POST /api/users');
    console.log('  - GET /api/events');
    console.log('  - POST /api/events/:id/register');
  });
});
