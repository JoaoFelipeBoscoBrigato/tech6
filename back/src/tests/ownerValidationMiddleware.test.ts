import { Request, Response, NextFunction } from "express";
import { checkOwnership } from "../middlewares/ownerValidationMiddleware";

interface CustomRequest extends Request {
  user?: { id: number };
}

describe("Middleware de Validação de Propriedade", () => {
  let mockRequest: Partial<CustomRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      params: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it("deve permitir acesso quando o usuário é o dono do recurso", () => {
    mockRequest.params = { id: "1" };
    mockRequest.user = { id: 1 };

    checkOwnership(
      mockRequest as CustomRequest,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it("deve negar acesso quando o usuário não é o dono do recurso", () => {
    mockRequest.params = { id: "2" };
    mockRequest.user = { id: 1 };

    checkOwnership(
      mockRequest as CustomRequest,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Você não tem permissão para modificar este recurso",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("deve negar acesso quando o ID do recurso é inválido", () => {
    mockRequest.params = { id: "invalid" };
    mockRequest.user = { id: 1 };

    checkOwnership(
      mockRequest as CustomRequest,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Você não tem permissão para modificar este recurso",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
