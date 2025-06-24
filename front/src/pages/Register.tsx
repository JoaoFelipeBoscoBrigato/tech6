/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    password: '',
    confirmPassword: '',
  });

  const [erro, setErro] = useState('');
  const [success, setSuccess] = useState('');

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
    setErro('');
    setSuccess('');

    const { name, email, cpf, password, confirmPassword } = formData;

    if (!name) return setErro('Please enter your name.');
    if (!email) return setErro('Please enter your email.');
    if (!cpf) return setErro('Please enter your CPF.');
    if (!password) return setErro('Please enter your password.');
    if (!confirmPassword) return setErro('Please confirm your password.');
    if (!validarEmail(email)) return setErro('Invalid email format');
    if (!validarCPF(cpf)) return setErro('Invalid CPF format');
    if (!senhaForte(password))
      return setErro('Password must be at least 6 characters');
    if (password !== confirmPassword) return setErro('Passwords do not match');

    try {
      await axios.post('http://localhost:3000/users', {
        name,
        email,
        cpf,
        password,
      });
      setSuccess('User registered successfully');
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (err: any) {
      if (
        err.response &&
        err.response.data &&
        err.response.data.error &&
        err.response.data.error.toLowerCase().includes('email')
      ) {
        setErro('Email already exists');
      } else if (err.response) {
        setErro(err.response?.data?.error || 'Registration error');
      } else {
        setErro('Unexpected error');
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
            data-cy="name-input"
          />
          {erro === 'Please enter your name.' && (
            <span data-cy="name-error">{erro}</span>
          )}
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
            data-cy="email-input"
          />
          {(erro === 'Please enter your email.' ||
            erro === 'Invalid email format') && (
            <span data-cy="email-error">{erro}</span>
          )}
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
            data-cy="cpf-input"
          />
          {(erro === 'Please enter your CPF.' ||
            erro === 'Invalid CPF format') && (
            <span data-cy="cpf-error">{erro}</span>
          )}
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
            data-cy="password-input"
          />
          {(erro === 'Please enter your password.' ||
            erro === 'Password must be at least 6 characters' ||
            erro === 'Please confirm your password.' ||
            erro === 'Passwords do not match') && (
            <span data-cy="password-error">{erro}</span>
          )}
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

        {success && (
          <p className="register-success" data-cy="success-message">
            {success}
          </p>
        )}
        {erro && (
          <p className="register-error" data-cy="error-message">
            {erro}
          </p>
        )}

        <button
          type="submit"
          className="register-button"
          data-cy="register-button"
        >
          Criar Conta
        </button>

        <div className="register-links">
          <Link to="/login" className="register-link" data-cy="login-link">
            Já tem uma conta? Faça login
          </Link>
        </div>
      </form>
    </div>
  );
}
