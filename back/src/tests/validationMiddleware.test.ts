import { Request, Response, NextFunction } from "express";
import {
  validateCPF,
  validatePasswordStrength,
} from "../middlewares/validationMiddleware";

describe("Validação de CPF", () => {
  it("deve aceitar um CPF válido", () => {
    const cpfValido = "123.456.789-09";
    expect(validateCPF(cpfValido)).toBe(true);
  });

  it("não deve aceitar um CPF inválido", () => {
    const cpfInvalido = "123.456.789-00";
    expect(validateCPF(cpfInvalido)).toBe(false);
  });

  it("não deve aceitar um CPF com todos os dígitos iguais", () => {
    const cpfInvalido = "111.111.111-11";
    expect(validateCPF(cpfInvalido)).toBe(false);
  });

  it("não deve aceitar um CPF com menos de 11 dígitos", () => {
    const cpfInvalido = "123.456.789";
    expect(validateCPF(cpfInvalido)).toBe(false);
  });
});

describe("Validação de Senha", () => {
  it("deve aceitar uma senha forte", () => {
    const senhaForte = "Senha@123";
    expect(validatePasswordStrength(senhaForte)).toBe(true);
  });

  it("não deve aceitar uma senha sem letra maiúscula", () => {
    const senhaFraca = "senha@123";
    expect(validatePasswordStrength(senhaFraca)).toBe(false);
  });

  it("não deve aceitar uma senha sem letra minúscula", () => {
    const senhaFraca = "SENHA@123";
    expect(validatePasswordStrength(senhaFraca)).toBe(false);
  });

  it("não deve aceitar uma senha sem número", () => {
    const senhaFraca = "Senha@abc";
    expect(validatePasswordStrength(senhaFraca)).toBe(false);
  });

  it("não deve aceitar uma senha sem caractere especial", () => {
    const senhaFraca = "Senha1234";
    expect(validatePasswordStrength(senhaFraca)).toBe(false);
  });

  it("não deve aceitar uma senha com menos de 8 caracteres", () => {
    const senhaFraca = "S@123";
    expect(validatePasswordStrength(senhaFraca)).toBe(false);
  });
});
