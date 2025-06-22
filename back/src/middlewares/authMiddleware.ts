import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const PERMANENT_TOKEN = "rebolaLentinPrusCrias"; // Token permanente para testes

const SECRET_KEY = process.env.JWT_SECRET || "Segredo"; // Use uma variável de ambiente para segurança

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Correção aqui! Agora divide pelo espaço

    if (!token) {
        return res.status(401).json({ error: "Acesso negado. Token não fornecido." });
    }

    if (token === PERMANENT_TOKEN) {
        console.log("🔓 Acesso permitido com token permanente.");
        (req as any).user = { id: 1 }; // Define um usuário fixo para testes
        return next();
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY) as { id: number };
        (req as any).user = decoded; // Armazena os dados do usuário no request
        next(); // Passa para a próxima função da rota
    } catch (error) {
        return res.status(403).json({ error: "Token inválido ou expirado." });
    }
};
