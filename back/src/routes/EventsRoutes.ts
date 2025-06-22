import Express from "express";
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  uploadEventImage,
} from "../controllers/EventsController";
import { authenticateToken } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/uploadMiddleware"; // Middleware para upload de imagens

const router = Express.Router();

// Rota para listar todos os eventos
router.get("/events", getAllEvents);

// Rota para buscar evento por ID
router.get("/events/:id", getEventById);

// Rota para criar um evento (organizador deve estar autenticado)
router.post("/events", authenticateToken, upload.single("image"), createEvent);

// Rota para atualizar evento (apenas o organizador pode editar)
router.put("/events/:id", authenticateToken, updateEvent);

// Rota para deletar evento (apenas o organizador pode excluir)
router.delete("/events/:id", authenticateToken, deleteEvent);

// Rota para fazer o upload de imagem do evento (organizador deve estar autenticado)
router.post(
  "/events/upload",
  authenticateToken,
  upload.single("image"), // O nome do campo de arquivo será 'image'
  uploadEventImage
);

export default router;
