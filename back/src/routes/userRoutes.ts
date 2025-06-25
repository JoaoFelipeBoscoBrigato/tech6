import { Router } from 'express';
import {
  getAll,
  getById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  updateSubscription,
  editProfile,
  changePassword,
} from '../controllers/usercontroller';
import { authenticateToken } from '../middlewares/authMiddleware';
import {
  cpfValidation,
  passwordValidation,
  emailValidation,
} from '../middlewares/validationMiddleware';
import { checkOwnership } from '../middlewares/ownerValidationMiddleware';

const router = Router();

// Log para debug
console.log('🔧 Configurando rotas de usuário...');

// Rotas de usuários
router.get('/', authenticateToken, getAll); // Apenas usuários autenticados podem listar usuários
router.get('/:id', authenticateToken, getById);

// Cadastro de usuário com validações
router.post(
  '/',
  [emailValidation, cpfValidation, passwordValidation],
  createUser
);

// Login de usuário (sem validações para teste)
router.post('/login', loginUser);
console.log('✅ Rota de login registrada: POST /login');

// Atualização de usuário com validações e verificação de propriedade
router.put(
  '/:id',
  [authenticateToken, checkOwnership, passwordValidation],
  updateUser
);

// Exclusão de usuário com verificação de propriedade
router.delete('/:id', [authenticateToken, checkOwnership], deleteUser);

// Rota para atualização da assinatura (tornar usuário um organizador)
router.post('/:id/subscribe', authenticateToken, updateSubscription);

// Editar perfil (nome e email)
router.put('/:id/profile', [authenticateToken, checkOwnership], editProfile);

// Trocar senha
router.put(
  '/:id/password',
  [authenticateToken, checkOwnership],
  changePassword
);

console.log('✅ Todas as rotas de usuário configuradas');

export default router;
