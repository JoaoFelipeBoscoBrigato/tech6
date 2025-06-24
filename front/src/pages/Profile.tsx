import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import { Button } from '../components/ui/button';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Profile() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const [profile, setProfile] = useState({ name: '', email: '' });
  const [profileMsg, setProfileMsg] = useState('');
  const [profileError, setProfileError] = useState('');

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (!userId || !token) {
      navigate('/login');
      return;
    }
    api
      .get<{ name: string; email: string }>(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProfile({ name: res.data.name, email: res.data.email }))
      .catch(() => navigate('/login'));
  }, [userId, token, navigate]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg('');
    setProfileError('');
    try {
      await api.put(`/users/${userId}/profile`, profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfileMsg('Perfil atualizado com sucesso!');
    } catch (err: any) {
      setProfileError(err.response?.data?.error || 'Erro ao atualizar perfil.');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg('');
    setPasswordError('');
    try {
      await api.put(`/users/${userId}/password`, passwords, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPasswordMsg('Senha alterada com sucesso!');
      setPasswords({ currentPassword: '', newPassword: '' });
    } catch (err: any) {
      setPasswordError(err.response?.data?.error || 'Erro ao trocar senha.');
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: '40px auto',
        padding: 24,
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 2px 8px #0001',
      }}
    >
      <h2>Editar Perfil</h2>
      <form onSubmit={handleProfileSubmit} style={{ marginBottom: 32 }}>
        <div style={{ marginBottom: 12 }}>
          <label>Nome</label>
          <input
            name="name"
            value={profile.name}
            onChange={handleProfileChange}
            className="register-input"
            data-cy="profile-name-input"
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <input
            name="email"
            value={profile.email}
            onChange={handleProfileChange}
            className="register-input"
            data-cy="profile-email-input"
          />
        </div>
        {profileMsg && <p style={{ color: 'green' }}>{profileMsg}</p>}
        {profileError && <p style={{ color: 'red' }}>{profileError}</p>}
        <Button type="submit">Salvar Alterações</Button>
      </form>
      <h2>Trocar Senha</h2>
      <form onSubmit={handlePasswordSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Senha Atual</label>
          <input
            type="password"
            name="currentPassword"
            value={passwords.currentPassword}
            onChange={handlePasswordChange}
            className="register-input"
            data-cy="current-password-input"
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Nova Senha</label>
          <input
            type="password"
            name="newPassword"
            value={passwords.newPassword}
            onChange={handlePasswordChange}
            className="register-input"
            data-cy="new-password-input"
          />
        </div>
        {passwordMsg && <p style={{ color: 'green' }}>{passwordMsg}</p>}
        {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
        <Button type="submit">Trocar Senha</Button>
      </form>
    </div>
  );
}
