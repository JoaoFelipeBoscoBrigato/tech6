import { Request, Response } from "express";
import {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
} from "../controllers/usercontroller";
import UserModel from "../models/UserModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

jest.mock("../models/UserModel");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

interface CustomRequest extends Request {
  params: {
    id: string;
  };
}

describe("Controller de Usuário", () => {
  let mockRequest: Partial<CustomRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      params: { id: "" },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe("Criação de Usuário", () => {
    it("deve criar um usuário com sucesso", async () => {
      mockRequest.body = {
        name: "Test User",
        email: "test@example.com",
        password: "Senha@123",
        cpf: "123.456.789-09",
      };

      (UserModel.findOne as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
      (UserModel.create as jest.Mock).mockResolvedValue({
        id: 1,
        ...mockRequest.body,
        password: "hashedPassword",
      });

      await createUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it("não deve criar usuário com e-mail duplicado", async () => {
      mockRequest.body = {
        name: "Test User",
        email: "test@example.com",
        password: "Senha@123",
        cpf: "123.456.789-09",
      };

      (UserModel.findOne as jest.Mock).mockResolvedValue({ id: 1 });

      await createUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Email already in use",
      });
    });
  });

  describe("Login de Usuário", () => {
    it("deve fazer login com sucesso", async () => {
      mockRequest.body = {
        email: "test@example.com",
        password: "Senha@123",
      };

      const mockUser = {
        id: 1,
        email: "test@example.com",
        password: "hashedPassword",
      };

      (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("mockToken");

      await loginUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith({ token: "mockToken" });
    });

    it("não deve fazer login com credenciais inválidas", async () => {
      mockRequest.body = {
        email: "test@example.com",
        password: "wrongPassword",
      };

      (UserModel.findOne as jest.Mock).mockResolvedValue(null);

      await loginUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Invalid credentials",
      });
    });
  });

  describe("Atualização de Usuário", () => {
    it("deve atualizar usuário com sucesso", async () => {
      mockRequest.params = { id: "1" };
      mockRequest.body = {
        name: "Updated Name",
        password: "NewPassword@123",
      };

      const mockUser = {
        id: 1,
        name: "Test User",
        save: jest.fn().mockResolvedValue(true),
      };

      (UserModel.findByPk as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue("newHashedPassword");

      await updateUser(mockRequest as CustomRequest, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it("não deve atualizar usuário inexistente", async () => {
      mockRequest.params = { id: "999" };
      mockRequest.body = {
        name: "Updated Name",
        password: "NewPassword@123",
      };

      (UserModel.findByPk as jest.Mock).mockResolvedValue(null);

      await updateUser(mockRequest as CustomRequest, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Usuário não encontrado",
      });
    });
  });

  describe("Exclusão de Usuário", () => {
    it("deve excluir usuário com sucesso", async () => {
      mockRequest.params = { id: "1" };

      const mockUser = {
        id: 1,
        destroy: jest.fn().mockResolvedValue(true),
      };

      (UserModel.findByPk as jest.Mock).mockResolvedValue(mockUser);

      await deleteUser(mockRequest as CustomRequest, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(204);
    });

    it("não deve excluir usuário inexistente", async () => {
      mockRequest.params = { id: "999" };

      (UserModel.findByPk as jest.Mock).mockResolvedValue(null);

      await deleteUser(mockRequest as CustomRequest, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "User not found",
      });
    });
  });
});
