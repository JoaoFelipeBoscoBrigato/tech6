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
  const [emailError, setEmailError] = useState('');
  const [cpfError, setCpfError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Limpar erro geral quando o usuário começar a corrigir
    if (erro) {
      setErro('');
    }
    
    // Validar email em tempo real
    if (name === 'email') {
      if (value && !validarEmail(value)) {
        setEmailError('O email deve terminar com @gmail.com');
      } else {
        setEmailError('');
      }
    }

    // Validar CPF em tempo real
    if (name === 'cpf') {
      // Remover caracteres não numéricos para validação
      const cpfNumeros = value.replace(/\D/g, '');
      if (value && cpfNumeros.length !== 11) {
        setCpfError('O CPF deve ter exatamente 11 números');
      } else {
        setCpfError('');
      }
    }

    // Validar senha em tempo real
    if (name === 'password') {
      if (value && !validarSenha(value)) {
        setPasswordError('A senha deve conter pelo menos uma letra maiúscula, um número, um caractere especial e ter mais de 6 dígitos');
      } else {
        setPasswordError('');
      }
      // Revalidar confirmação de senha quando a senha principal muda
      if (formData.confirmPassword && value !== formData.confirmPassword) {
        setConfirmPasswordError('As senhas não coincidem');
      } else if (formData.confirmPassword && value === formData.confirmPassword) {
        setConfirmPasswordError('');
      }
    }

    // Validar confirmação de senha em tempo real
    if (name === 'confirmPassword') {
      if (value && value !== formData.password) {
        setConfirmPasswordError('As senhas não coincidem');
      } else {
        setConfirmPasswordError('');
      }
    }
  };

  const validarEmail = (email: string) => {
    if (!email.endsWith('@gmail.com')) {
      return false;
    }
    return true;
  };

  const validarSenha = (senha: string) => {
    // Verificar se tem mais de 6 dígitos
    if (senha.length <= 6) return false;
    
    // Verificar se tem pelo menos uma letra maiúscula
    if (!/[A-Z]/.test(senha)) return false;
    
    // Verificar se tem pelo menos um número
    if (!/\d/.test(senha)) return false;
    
    // Verificar se tem pelo menos um caractere especial
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha)) return false;
    
    return true;
  };

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
    if (!validarEmail(email)) return setErro('O email deve terminar com @gmail.com');
    
    // Validar CPF usando a mesma lógica da validação em tempo real
    const cpfNumeros = cpf.replace(/\D/g, '');
    if (cpfNumeros.length !== 11) return setErro('O CPF deve ter exatamente 11 números');
    
    if (!validarSenha(password)) return setErro('A senha deve conter pelo menos uma letra maiúscula, um número, um caractere especial e ter mais de 6 dígitos');
    if (password !== confirmPassword) return setErro('As senhas não coincidem');

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
            className={`register-input ${emailError ? 'register-input-error' : ''}`}
            value={formData.email}
            onChange={handleChange}
            placeholder="seu@gmail.com"
            data-cy="email-input"
          />
          {emailError && (
            <span className="register-field-error" data-cy="email-error">{emailError}</span>
          )}
          {(erro === 'Please enter your email.' ||
            erro === 'O email deve terminar com @gmail.com') && (
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
            className={`register-input ${cpfError ? 'register-input-error' : ''}`}
            value={formData.cpf}
            onChange={handleChange}
            placeholder="Seu CPF"
            data-cy="cpf-input"
          />
          {cpfError && (
            <span className="register-field-error" data-cy="cpf-error">{cpfError}</span>
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
            className={`register-input ${passwordError ? 'register-input-error' : ''}`}
            value={formData.password}
            onChange={handleChange}
            placeholder="Sua senha"
            data-cy="password-input"
          />
          {passwordError && (
            <span className="register-field-error" data-cy="password-error">{passwordError}</span>
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
            className={`register-input ${confirmPasswordError ? 'register-input-error' : ''}`}
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirme sua senha"
          />
          {confirmPasswordError && (
            <span className="register-field-error" data-cy="confirm-password-error">{confirmPasswordError}</span>
          )}
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
