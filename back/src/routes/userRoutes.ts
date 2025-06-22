import { Router } from "express";
import {
  getAll,
  getById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  updateSubscription,
} from "../controllers/usercontroller";
import { authenticateToken } from "../middlewares/authMiddleware";
import {
  cpfValidation,
  passwordValidation,
  emailValidation,
} from "../middlewares/validationMiddleware";
import { checkOwnership } from "../middlewares/ownerValidationMiddleware";

const router = Router();

// Rotas de usuários
router.get("/users", authenticateToken, getAll); // Apenas usuários autenticados podem listar usuários
router.get("/users/:id", authenticateToken, getById);

// Cadastro de usuário com validações
router.post(
  "/users",
  [emailValidation, cpfValidation, passwordValidation],
  createUser
);

// Login de usuário
router.post("/users/login", loginUser);

// Atualização de usuário com validações e verificação de propriedade
router.put(
  "/users/:id",
  [authenticateToken, checkOwnership, passwordValidation],
  updateUser
);

// Exclusão de usuário com verificação de propriedade
router.delete("/users/:id", [authenticateToken, checkOwnership], deleteUser);

// Rota para atualização da assinatura (tornar usuário um organizador)
router.post("/users/:id/subscribe", authenticateToken, updateSubscription);

export default router;
