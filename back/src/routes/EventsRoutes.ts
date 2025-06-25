import Express from 'express';
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  uploadEventImage,
<<<<<<< HEAD
  getEventParticipants,
} from '../controllers/EventsController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { isOrganizer } from '../middlewares/organizerAuthMiddleware';
=======
} from '../controllers/EventsController';
import { authenticateToken } from '../middlewares/authMiddleware';
>>>>>>> ed3a751d1602e4f18ae42998c040ef3798320499
import { upload } from '../middlewares/uploadMiddleware'; // Middleware para upload de imagens

const router = Express.Router();

// Rota para listar todos os eventos
router.get('/events', getAllEvents);

// Rota para buscar evento por ID
router.get('/events/:id', getEventById);

// Rota para criar um evento (organizador deve estar autenticado)
router.post('/events', authenticateToken, upload.single('image'), createEvent);

// Rota para atualizar evento (apenas o organizador pode editar)
router.put('/events/:id', authenticateToken, updateEvent);

// Rota para deletar evento (apenas o organizador pode excluir)
router.delete('/events/:id', authenticateToken, deleteEvent);

// Rota para fazer o upload de imagem do evento (organizador deve estar autenticado)
router.post(
  '/events/upload',
  authenticateToken,
  upload.single('image'), // O nome do campo de arquivo será 'image'
  uploadEventImage
);

<<<<<<< HEAD
// Rota para buscar participantes de um evento (apenas organizadores)
router.get(
  '/events/:id/participants',
  authenticateToken,
  isOrganizer,
  getEventParticipants
);

=======
>>>>>>> ed3a751d1602e4f18ae42998c040ef3798320499
export default router;
