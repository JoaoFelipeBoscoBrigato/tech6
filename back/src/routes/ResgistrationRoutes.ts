import { Router } from "express";
import RegistrationsController from "../controllers/resgistrationsController";
import { authenticateToken } from "../middlewares/authMiddleware";

const RegistrationRouter = Router();

// Rota para criar uma inscrição em um evento
RegistrationRouter.post(
  "/events/:id/register",
  authenticateToken,
  RegistrationsController.register
);

// Rota para cancelar uma inscrição
RegistrationRouter.delete(
  "/events/:id/register",
  authenticateToken,
  RegistrationsController.cancel
);

// Rota para listar inscrições do usuário autenticado
RegistrationRouter.get(
  "/me",
  authenticateToken,
  RegistrationsController.listUserRegistrations
);

export default RegistrationRouter;
