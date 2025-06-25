/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
  });
  const [erro, setErro] = useState('');
<<<<<<< HEAD
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
=======
>>>>>>> ed3a751d1602e4f18ae42998c040ef3798320499

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
<<<<<<< HEAD
    setEmailError('');
    setPasswordError('');

    const { email, senha } = formData;

    if (!email) setEmailError('Please enter your email.');
    if (!senha) setPasswordError('Please enter your password.');
    if (!email || !senha) return setErro('Please fill in all fields.');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setEmailError('Invalid email format');
      return setErro('Invalid email format');
=======

    const { email, senha } = formData;

    if (!email || !senha) {
      return setErro('Preencha todos os campos.');
>>>>>>> ed3a751d1602e4f18ae42998c040ef3798320499
    }

    try {
      const response = await axios.post('http://localhost/api/users/login', {
        email,
        password: senha,
      });

      const { token } = response.data;
      const payload = JSON.parse(atob(token.split('.')[1]));

      localStorage.setItem('token', token);
      localStorage.setItem('userType', payload.type);
      localStorage.setItem('userId', response.data.id);

      navigate('/home');
    } catch (err: any) {
<<<<<<< HEAD
      if (
        err.response &&
        err.response.data &&
        err.response.data.error &&
        err.response.data.error.toLowerCase().includes('invalid')
      ) {
        setErro('Invalid credentials');
      } else if (err.response) {
        setErro(err.response?.data?.error || 'Login error');
      } else {
        setErro('Unexpected error');
=======
      if (axios.isAxiosError(err)) {
        setErro(err.response?.data?.error || 'Erro ao fazer login.');
      } else {
        setErro('Erro inesperado.');
>>>>>>> ed3a751d1602e4f18ae42998c040ef3798320499
      }
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1 className="login-title">Login</h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="login-input"
          value={formData.email}
          onChange={handleChange}
<<<<<<< HEAD
          data-cy="email-input"
        />
        {emailError && <span data-cy="email-error">{emailError}</span>}
=======
        />
>>>>>>> ed3a751d1602e4f18ae42998c040ef3798320499

        <input
          type="password"
          name="senha"
          placeholder="Senha"
          className="login-input"
          value={formData.senha}
          onChange={handleChange}
<<<<<<< HEAD
          data-cy="password-input"
        />
        {passwordError && <span data-cy="password-error">{passwordError}</span>}

        {erro && (
          <p className="login-error" data-cy="error-message">
            {erro}
          </p>
        )}

        <button type="submit" className="login-button" data-cy="login-button">
=======
        />

        {erro && <p className="login-error">{erro}</p>}

        <button type="submit" className="login-button">
>>>>>>> ed3a751d1602e4f18ae42998c040ef3798320499
          Entrar
        </button>

        <div className="login-links">
<<<<<<< HEAD
          <Link to="/register" className="login-link" data-cy="register-link">
=======
          <Link to="/register" className="login-link">
>>>>>>> ed3a751d1602e4f18ae42998c040ef3798320499
            Não tem uma conta? Registre-se
          </Link>
        </div>
      </form>
    </div>
  );
}
