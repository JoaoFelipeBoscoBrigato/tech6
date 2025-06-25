import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import './Profile.css';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Profile() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const [profile, setProfile] = useState({ name: '', email: '' });
  const [profileMsg, setProfileMsg] = useState('');
  const [profileError, setProfileError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isProfileValid, setIsProfileValid] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

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

  const validateEmail = (email: string) => {
    if (!email.endsWith('@gmail.com')) {
      setEmailError('O email deve terminar com @gmail.com');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
    
    if (name === 'email') {
      const emailValid = validateEmail(value);
      const hasChanges = value !== profile.email;
      setIsProfileValid(Boolean(hasChanges && emailValid));
    } else {
      const hasChanges = value !== profile.name;
      const emailValid = validateEmail(profile.email);
      setIsProfileValid(Boolean(hasChanges && emailValid));
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg('');
    setProfileError('');
    
    if (!validateEmail(profile.email)) {
      return;
    }
    
    try {
      await api.put(`/users/${userId}/profile`, profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfileMsg('Perfil atualizado com sucesso!');
      setIsProfileValid(false); // Reset do estado após sucesso
    } catch (err: any) {
      setProfileError(err.response?.data?.error || 'Erro ao atualizar perfil.');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
    
    // Verifica se ambos os campos estão preenchidos
    const hasChanges = (name === 'currentPassword' && value !== passwords.currentPassword) ||
                      (name === 'newPassword' && value !== passwords.newPassword);
    const bothFilled = (name === 'currentPassword' ? value : passwords.currentPassword) &&
                      (name === 'newPassword' ? value : passwords.newPassword);
    setIsPasswordValid(hasChanges && bothFilled);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg('');
    setPasswordError('');
    
    // Verificar se a senha atual foi preenchida
    if (!passwords.currentPassword.trim()) {
      setModalMessage('Por favor, insira sua senha atual.');
      setShowErrorModal(true);
      return;
    }
    
    // Verificar se a nova senha foi preenchida
    if (!passwords.newPassword.trim()) {
      setModalMessage('Por favor, insira a nova senha.');
      setShowErrorModal(true);
      return;
    }
    
    try {
      await api.put(`/users/${userId}/password`, passwords, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPasswordMsg('Senha alterada com sucesso!');
      setPasswords({ currentPassword: '', newPassword: '' });
      setIsPasswordValid(false); // Reset do estado após sucesso
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Erro ao trocar senha.';
      setModalMessage(errorMessage);
      setShowErrorModal(true);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1 className="profile-title">Editar Perfil</h1>
        
        <div className="profile-section">
          <h2 className="profile-section-title">Informações Pessoais</h2>
          <form onSubmit={handleProfileSubmit} className="profile-form">
            <div className="profile-input-group">
              <label className="profile-label">Nome</label>
              <input
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                className="profile-input"
                data-cy="profile-name-input"
              />
            </div>
            <div className="profile-input-group">
              <label className="profile-label">Email</label>
              <input
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                className={`profile-input ${emailError ? 'profile-input-error' : ''}`}
                data-cy="profile-email-input"
              />
              {emailError && <p className="profile-error-message">{emailError}</p>}
            </div>
            {profileMsg && <p className="profile-message profile-success">{profileMsg}</p>}
            {profileError && <p className="profile-message profile-error">{profileError}</p>}
            <button 
              type="submit" 
              className={`profile-button ${isProfileValid ? 'profile-button-success' : ''}`}
              disabled={!isProfileValid}
            >
              Salvar Alterações
            </button>
          </form>
        </div>

        <div className="profile-section">
          <h2 className="profile-section-title">Trocar Senha</h2>
          <form onSubmit={handlePasswordSubmit} className="profile-form">
            <div className="profile-input-group">
              <label className="profile-label">Senha Atual</label>
              <div className="profile-password-container">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  name="currentPassword"
                  value={passwords.currentPassword}
                  onChange={handlePasswordChange}
                  className="profile-input"
                  data-cy="current-password-input"
                />
                <button
                  type="button"
                  className="profile-password-toggle"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>
            <div className="profile-input-group">
              <label className="profile-label">Nova Senha</label>
              <div className="profile-password-container">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                  className="profile-input"
                  data-cy="new-password-input"
                />
                <button
                  type="button"
                  className="profile-password-toggle"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>
            {passwordMsg && <p className="profile-message profile-success">{passwordMsg}</p>}
            {passwordError && <p className="profile-message profile-error">{passwordError}</p>}
            <button 
              type="submit" 
              className={`profile-button ${isPasswordValid ? 'profile-button-success' : ''}`}
              disabled={!isPasswordValid}
            >
              Trocar Senha
            </button>
          </form>
        </div>

        <div className="profile-back-section">
          <button 
            onClick={() => navigate('/')}
            className="profile-back-home-button"
          >
            Voltar para o Home
          </button>
        </div>
      </div>

      {/* Modal de Erro */}
      {showErrorModal && (
        <div className="profile-modal-overlay">
          <div className="profile-modal">
            <div className="profile-modal-header">
              <h3 className="profile-modal-title">Atenção</h3>
              <button 
                className="profile-modal-close"
                onClick={() => setShowErrorModal(false)}
              >
                ×
              </button>
            </div>
            <div className="profile-modal-content">
              <p className="profile-modal-message">{modalMessage}</p>
            </div>
            <div className="profile-modal-footer">
              <button 
                className="profile-modal-button"
                onClick={() => setShowErrorModal(false)}
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}