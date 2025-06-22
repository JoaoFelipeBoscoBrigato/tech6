/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    password: "",
    confirmPassword: "",
  });

  const [erro, setErro] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validarEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validarCPF = (cpf: string) => {
    const regex = /^\d{11}$/;
    return regex.test(cpf);
  };

  const senhaForte = (senha: string) => senha.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    const { name, email, cpf, password, confirmPassword } = formData;

    if (!name || !email || !cpf || !password || !confirmPassword) {
      return setErro("Preencha todos os campos.");
    }

    if (!validarEmail(email)) return setErro("E-mail inválido.");
    if (!validarCPF(cpf)) return setErro("CPF inválido. Use apenas números.");
    if (!senhaForte(password))
      return setErro("A senha deve ter pelo menos 6 caracteres.");
    if (password !== confirmPassword)
      return setErro("As senhas não coincidem.");

    try {
      await axios.post("http://localhost:3000/users", {
        name,
        email,
        cpf,
        password,
      });

      navigate("/login");
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setErro(err.response?.data?.error || "Erro ao criar conta.");
      } else {
        setErro("Erro inesperado.");
      }
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h1 className="register-title">Criar Conta</h1>
        <p className="register-subtitle">
          Preencha os campos abaixo para se registrar
        </p>

        <div className="register-input-group">
          <label htmlFor="name" className="register-label">
            Nome
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="register-input"
            value={formData.name}
            onChange={handleChange}
            placeholder="Seu nome completo"
          />
        </div>

        <div className="register-input-group">
          <label htmlFor="email" className="register-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="register-input"
            value={formData.email}
            onChange={handleChange}
            placeholder="seu@email.com"
          />
        </div>

        <div className="register-input-group">
          <label htmlFor="cpf" className="register-label">
            CPF (apenas números)
          </label>
          <input
            type="text"
            id="cpf"
            name="cpf"
            className="register-input"
            value={formData.cpf}
            onChange={handleChange}
            placeholder="Seu CPF"
          />
        </div>

        <div className="register-input-group">
          <label htmlFor="password" className="register-label">
            Senha
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="register-input"
            value={formData.password}
            onChange={handleChange}
            placeholder="Sua senha"
          />
        </div>

        <div className="register-input-group">
          <label htmlFor="confirmPassword" className="register-label">
            Confirmar Senha
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="register-input"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirme sua senha"
          />
        </div>

        {erro && <p className="register-error">{erro}</p>}

        <button type="submit" className="register-button">
          Criar Conta
        </button>

        <div className="register-links">
          <Link to="/login" className="register-link">
            Já tem uma conta? Faça login
          </Link>
        </div>
      </form>
    </div>
  );
}
