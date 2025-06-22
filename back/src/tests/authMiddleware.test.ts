import { Request, Response, NextFunction } from "express";
import { authenticateToken } from "../middlewares/authMiddleware";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken");

describe("Middleware de Autenticação", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it("deve rejeitar requisição sem token", () => {
    authenticateToken(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Acesso negado. Token não fornecido.",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("deve aceitar token válido", () => {
    const mockToken = "valid.token.here";
    mockRequest.headers = {
      authorization: `Bearer ${mockToken}`,
    };

    (jwt.verify as jest.Mock).mockReturnValue({ id: 1 });

    authenticateToken(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it("deve rejeitar token inválido", () => {
    const mockToken = "invalid.token.here";
    mockRequest.headers = {
      authorization: `Bearer ${mockToken}`,
    };

    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("Token inválido");
    });

    authenticateToken(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Token inválido ou expirado.",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("deve aceitar token permanente para testes", () => {
    const permanentToken = "rebolaLentinPrusCrias";
    mockRequest.headers = {
      authorization: `Bearer ${permanentToken}`,
    };

    authenticateToken(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect((mockRequest as any).user).toEqual({ id: 1 });
  });
});
