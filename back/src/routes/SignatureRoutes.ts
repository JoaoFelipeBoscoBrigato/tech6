import express from "express";
import {
  createSignature,
  getUserSubscriptions,
  updateSignature,
  cancelSignature,
  checkSubscriptionStatus,
} from "../controllers/SignatureController"; // Importando os métodos do controller
import { authenticateToken } from "../middlewares/authMiddleware"; // Importando o middleware de autenticação

const SignatureRouter = express.Router();

// Rota para criar uma nova assinatura - Usuário autenticado
SignatureRouter.post("/signature", authenticateToken, createSignature); // Middleware de autenticação

// Rota para listar assinaturas de um usuário - Usuário autenticado
SignatureRouter.get(
  "/subscriptions/:user_id",
  authenticateToken,
  getUserSubscriptions
); // Middleware de autenticação

// Rota para atualizar uma assinatura (renovação) - Usuário autenticado
SignatureRouter.put("/signature/:id", authenticateToken, updateSignature); // Middleware de autenticação

// Rota para cancelar uma assinatura - Usuário autenticado
SignatureRouter.delete("/signature/:id", authenticateToken, cancelSignature); // Middleware de autenticação

// Rota para verificar o status da assinatura - Usuário autenticado
SignatureRouter.get(
  "/subscription/status/:user_id",
  authenticateToken,
  checkSubscriptionStatus
); // Middleware de autenticação

export default SignatureRouter;
