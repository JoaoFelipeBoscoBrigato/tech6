import { Request, Response } from "express";
import SignatureModel from "../models/SignatureModal"; // Importando o modelo de assinatura
import { Op } from "sequelize";
import UserModel from "../models/UserModel"; // Importando o modelo de usuário

// Criar uma nova assinatura
export const createSignature = async (req: Request, res: Response) => {
  const { user_id, plan } = req.body; // Pegando os dados enviados no corpo da requisição

  // Verificar se o usuário existe
  const user = await UserModel.findByPk(user_id);
  if (!user) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }

  // Verificando se o usuário já tem uma assinatura ativa
  const existingSubscription = await SignatureModel.findOne({
    where: {
      user_id,
      status: "ativa",
    },
  });

  if (existingSubscription) {
    return res.status(400).json({ message: "O usuário já possui uma assinatura ativa." });
  }

  // Criando a nova assinatura
  const newSubscription = await SignatureModel.create({
    user_id,
    plan,
    status: "ativa",
    start_date: new Date(),
    end_date: new Date(new Date().setFullYear(new Date().getFullYear() + (plan === "anual" ? 1 : 0.083))), // 1 ano para plano anual ou 1 mês para plano mensal
  });

  return res.status(201).json(newSubscription);
};

// Listar as assinaturas de um usuário
export const getUserSubscriptions = async (req: Request, res: Response) => {
  const { user_id } = req.params;

  const subscriptions = await SignatureModel.findAll({
    where: { user_id },
  });

  if (subscriptions.length === 0) {
    return res.status(404).json({ message: "Nenhuma assinatura encontrada para este usuário." });
  }

  return res.status(200).json(subscriptions);
};

// Atualizar uma assinatura (por exemplo, renovação)
export const updateSignature = async (req: Request, res: Response) => {
  const { id } = req.params; // ID da assinatura a ser atualizada
  const { plan, status } = req.body; // Dados para atualizar

  // Procurar a assinatura
  const subscription = await SignatureModel.findByPk(id);
  if (!subscription) {
    return res.status(404).json({ message: "Assinatura não encontrada." });
  }

  // Atualizando os dados da assinatura
  subscription.plan = plan || subscription.plan;
  subscription.status = status || subscription.status;

  // Se renovando para o próximo período
  if (status === "ativa") {
    const newEndDate = new Date(
      new Date().setFullYear(new Date().getFullYear() + (plan === "anual" ? 1 : 0.083))
    );
    subscription.end_date = newEndDate;
  }

  await subscription.save();

  return res.status(200).json(subscription);
};

// Cancelar uma assinatura
export const cancelSignature = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Procurar a assinatura
  const subscription = await SignatureModel.findByPk(id);
  if (!subscription) {
    return res.status(404).json({ message: "Assinatura não encontrada." });
  }

  // Cancelando a assinatura
  subscription.status = "cancelada";
  await subscription.save();

  return res.status(200).json({ message: "Assinatura cancelada com sucesso." });
};

// Verificar o status da assinatura
export const checkSubscriptionStatus = async (req: Request, res: Response) => {
  const { user_id } = req.params;

  // Procurar a assinatura ativa do usuário
  const subscription = await SignatureModel.findOne({
    where: {
      user_id,
      status: "ativa",
    },
  });

  if (!subscription) {
    return res.status(404).json({ message: "Usuário não possui assinatura ativa." });
  }

  return res.status(200).json(subscription);
};