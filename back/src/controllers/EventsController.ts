import { Request, Response } from "express";
import EventsModel from "../models/EventsModel";
import { authenticateToken } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/uploadMiddleware";
import jwt from "jsonwebtoken";

// Estender a interface Request para incluir a propriedade file
interface MulterRequest extends Request {
  file?: Express.Multer.File;
  user?: any;
}

// Upload de imagem para evento
export const uploadEventImage = async (req: MulterRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhuma imagem enviada." });
    }

    const imageUrl = `/uploads/${req.file.filename}`; // Caminho da imagem salva

    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ error: "Erro ao fazer upload da imagem." });
  }
};

// Criar evento
export const createEvent = async (req: MulterRequest, res: Response) => {
  try {
    const { name, date, location, description } = req.body;
    let image_url = null;

    // Verifica se o usuário está autenticado
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Token não fornecido" });
    }

    // Decodifica o token para obter o ID do organizador
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "segredoUltraSecreto123"
    ) as { id: number };
    const organizer_id = decoded.id;

    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }

    const event = await EventsModel.create({
      name,
      date,
      location,
      description,
      image_url,
      organizer_id,
    });

    res.status(201).json(event);
  } catch (error) {
    console.error("Erro ao criar evento:", error);
    res.status(500).json({ error: "Erro ao criar evento." });
  }
};

// Listar todos os eventos
export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const events = await EventsModel.findAll();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar eventos." });
  }
};

// Buscar evento por ID
export const getEventById = async (req: Request, res: Response) => {
  try {
    const event = await EventsModel.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Evento não encontrado." });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar evento." });
  }
};

// Atualizar evento
export const updateEvent = async (req: MulterRequest, res: Response) => {
  try {
    const { name, date, location, description } = req.body;
    let image_url = null;

    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }

    const event = await EventsModel.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Evento não encontrado." });
    }

    await event.update({
      name,
      date,
      location,
      description,
      image_url: image_url || event.image_url,
    });

    res.json(event);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar evento." });
  }
};

// Deletar evento
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const event = await EventsModel.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Evento não encontrado." });
    }

    await event.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar evento." });
  }
};
