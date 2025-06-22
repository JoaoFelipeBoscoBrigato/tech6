import { Request, Response } from "express";
import RegistrationsModel from "../models/registrationsModal";
import EventsModel from "../models/EventsModel";
import UserModel from "../models/UserModel";

class RegistrationsController {
  // Criar uma nova inscrição
  static async register(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const eventId = parseInt(req.params.id);

      if (isNaN(eventId)) {
        return res.status(400).json({ error: "ID do evento inválido." });
      }

      // Verificar se o evento existe
      const event = await EventsModel.findByPk(eventId);
      if (!event) {
        return res.status(404).json({ error: "Evento não encontrado." });
      }

      // Verificar se o usuário já está inscrito
      const existingRegistration = await RegistrationsModel.findOne({
        where: { user_id: userId, event_id: eventId },
      });
      if (existingRegistration) {
        return res
          .status(409)
          .json({ error: "Usuário já inscrito neste evento." });
      }

      // Criar a inscrição
      const registration = await RegistrationsModel.create({
        user_id: userId,
        event_id: eventId,
        registration_date: new Date(),
      });

      return res.status(201).json(registration);
    } catch (error) {
      console.error("Erro ao processar inscrição:", error);
      return res.status(500).json({ error: "Erro ao processar inscrição." });
    }
  }

  // Cancelar uma inscrição
  static async cancel(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const eventId = parseInt(req.params.id);

      if (isNaN(eventId)) {
        return res.status(400).json({ error: "ID do evento inválido." });
      }

      // Verificar se a inscrição existe
      const registration = await RegistrationsModel.findOne({
        where: { user_id: userId, event_id: eventId },
      });
      if (!registration) {
        return res.status(404).json({ error: "Inscrição não encontrada." });
      }

      // Remover a inscrição
      await registration.destroy();

      return res
        .status(200)
        .json({ message: "Inscrição cancelada com sucesso." });
    } catch (error) {
      console.error("Erro ao cancelar inscrição:", error);
      return res.status(500).json({ error: "Erro ao cancelar inscrição." });
    }
  }

  // Listar inscrições de um usuário
  static async listUserRegistrations(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const registrations = await RegistrationsModel.findAll({
        where: { user_id: userId },
        include: [{ model: EventsModel, as: "event" }],
      });

      return res.status(200).json(registrations);
    } catch (error) {
      console.error("Erro ao listar inscrições:", error);
      return res.status(500).json({ error: "Erro ao listar inscrições." });
    }
  }
}

export default RegistrationsController;
