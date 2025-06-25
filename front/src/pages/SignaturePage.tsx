import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import './SignaturePage.css';

interface DecodedToken {
  id: number;
  type: string;
  exp: number;
}

const SignaturePage: React.FC = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [plan, setPlan] = useState<'mensal' | 'anual'>('mensal');
<<<<<<< HEAD
  const [paymentMethod, setPaymentMethod] = useState<'credit-card' | 'pix'>(
    'credit-card'
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
=======
  const [loading, setLoading] = useState(false);
>>>>>>> ed3a751d1602e4f18ae42998c040ef3798320499
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Você precisa estar logado para assinar.');
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      setUserId(decoded.id);
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      alert('Sessão inválida. Faça login novamente.');
      navigate('/login');
    }
  }, [navigate]);

  const handleSubscribe = async () => {
    if (!userId) return;

    setLoading(true);
<<<<<<< HEAD
    setSuccess('');
    setError('');
    try {
      const token = localStorage.getItem('token');

      // Simular validação de seleção de plano e pagamento
      if (!plan) {
        setError('Please select a plan');
        setLoading(false);
        return;
      }
      if (!paymentMethod) {
        setError('Please select a payment method');
        setLoading(false);
        return;
      }

=======
    try {
      const token = localStorage.getItem('token');

>>>>>>> ed3a751d1602e4f18ae42998c040ef3798320499
      await axios.post(
        `${import.meta.env.VITE_API_URL}/signatures`,
        { user_id: userId, plan },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await axios.post(
        `${import.meta.env.VITE_API_URL}/users/${userId}/subscribe`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

<<<<<<< HEAD
      setSuccess('Signature created successfully');
      setTimeout(() => {
        alert('Assinatura realizada com sucesso! Você agora é um organizador.');
        navigate('/home');
      }, 1000);
    } catch (error) {
      setError('Invalid credit card number');
=======
      alert('Assinatura realizada com sucesso! Você agora é um organizador.');
      navigate('/home');
    } catch (error) {
>>>>>>> ed3a751d1602e4f18ae42998c040ef3798320499
      console.error('Erro ao assinar:', error);
      alert('Erro ao assinar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signature-container">
      <div className="signature-card">
        <h1 className="signature-title">La Vamos Nós 🚀</h1>
        <p className="signature-subtitle">
          Assine um plano e torne-se <strong>organizador</strong> da plataforma.
          Gerencie seus eventos com facilidade e alcance mais pessoas!
        </p>

        <div className="signature-plan-group">
          <label className="signature-label">Escolha seu plano:</label>
<<<<<<< HEAD
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <button
              type="button"
              className={`signature-plan-btn${plan === 'mensal' ? ' selected' : ''}`}
              data-cy="plan-basic"
              onClick={() => setPlan('mensal')}
            >
              Mensal - R$ 19,90
            </button>
            <button
              type="button"
              className={`signature-plan-btn${plan === 'anual' ? ' selected' : ''}`}
              data-cy="plan-premium"
              onClick={() => setPlan('anual')}
            >
              Anual - R$ 199,90
            </button>
          </div>
        </div>
        <div className="signature-payment-group">
          <label className="signature-label">Método de pagamento:</label>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <button
              type="button"
              className={`signature-payment-btn${paymentMethod === 'credit-card' ? ' selected' : ''}`}
              data-cy="payment-credit-card"
              onClick={() => setPaymentMethod('credit-card')}
            >
              Cartão de Crédito
            </button>
            <button
              type="button"
              className={`signature-payment-btn${paymentMethod === 'pix' ? ' selected' : ''}`}
              data-cy="payment-pix"
              onClick={() => setPaymentMethod('pix')}
            >
              Pix
            </button>
          </div>
        </div>
        {success && (
          <p className="signature-success" data-cy="success-message">
            {success}
          </p>
        )}
        {error && (
          <p className="signature-error" data-cy="error-message">
            {error}
          </p>
        )}
=======
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value as 'mensal' | 'anual')}
            className="signature-select"
          >
            <option value="mensal">Mensal - R$ 19,90</option>
            <option value="anual">Anual - R$ 199,90 (Economize 16%)</option>
          </select>
        </div>
>>>>>>> ed3a751d1602e4f18ae42998c040ef3798320499

        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="signature-button"
<<<<<<< HEAD
          data-cy="create-signature-button"
=======
>>>>>>> ed3a751d1602e4f18ae42998c040ef3798320499
        >
          {loading ? 'Processando...' : 'Assinar agora'}
        </button>

        <div className="signature-benefits">
          <h3 className="signature-benefits-title">
            Benefícios da assinatura:
          </h3>
          <ul className="signature-benefits-list">
            <li className="signature-benefit-item">
              <span className="signature-benefit-icon">✓</span>
              Crie e gerencie eventos ilimitados
            </li>
            <li className="signature-benefit-item">
              <span className="signature-benefit-icon">✓</span>
              Dashboard personalizado
            </li>
            <li className="signature-benefit-item">
              <span className="signature-benefit-icon">✓</span>
              Relatórios detalhados
            </li>
            <li className="signature-benefit-item">
              <span className="signature-benefit-icon">✓</span>
              Suporte prioritário
            </li>
          </ul>
        </div>
<<<<<<< HEAD

        <div className="signature-back-container">
          <button
            onClick={() => navigate('/home')}
            className="back-home-button"
            data-cy="back-home-button"
          >
            <span className="back-arrow">←</span>
            Voltar ao Home
          </button>
        </div>
=======
>>>>>>> ed3a751d1602e4f18ae42998c040ef3798320499
      </div>
    </div>
  );
};

export default SignaturePage;
