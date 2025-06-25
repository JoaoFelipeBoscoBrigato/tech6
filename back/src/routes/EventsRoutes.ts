import Express from 'express';
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  uploadEventImage,
  getEventParticipants,
} from '../controllers/EventsController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { isOrganizer } from '../middlewares/organizerAuthMiddleware';
import { upload } from '../middlewares/uploadMiddleware'; // Middleware para upload de imagens
import RegistrationsController from '../controllers/resgistrationsController';

const router = Express.Router();

// Rota para listar todos os eventos
router.get('/', getAllEvents);

// Rota para buscar evento por ID
router.get('/:id', getEventById);

// Rota para criar um evento (organizador deve estar autenticado)
router.post('/', authenticateToken, upload.single('image'), createEvent);

// Rota para atualizar evento (apenas o organizador pode editar)
router.put('/:id', authenticateToken, updateEvent);

// Rota para deletar evento (apenas o organizador pode excluir)
router.delete('/:id', authenticateToken, deleteEvent);

// Rota para fazer o upload de imagem do evento (organizador deve estar autenticado)
router.post(
  '/upload',
  authenticateToken,
  upload.single('image'), // O nome do campo de arquivo será 'image'
  uploadEventImage
);

// Rota para buscar participantes de um evento (apenas organizadores)
router.get(
  '/:id/participants',
  authenticateToken,
  isOrganizer,
  getEventParticipants
);

// Rota para registrar em um evento
router.post(
  '/:id/register',
  authenticateToken,
  RegistrationsController.register
);

export default router;
