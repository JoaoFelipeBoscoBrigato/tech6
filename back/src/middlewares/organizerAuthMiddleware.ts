import { Request, Response, NextFunction } from "express";

// Middleware para verificar se o usuário é um organizador
export const isOrganizer = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;

  if (!user || user.type !== "organizador") {
    return res
      .status(403)
      .json({ message: "Acesso negado. Apenas organizadores." });
  }

  next();
};
