import { Request, Response, NextFunction } from "express";

export const checkOwnership = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = (req as any).user.id;
  const requestedUserId = parseInt(req.params.id);

  if (userId !== requestedUserId) {
    return res
      .status(403)
      .json({ error: "Você não tem permissão para modificar este recurso" });
  }

  next();
};
