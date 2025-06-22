import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "./SignaturePage.css";

interface DecodedToken {
  id: number;
  type: string;
  exp: number;
}

const SignaturePage: React.FC = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [plan, setPlan] = useState<"mensal" | "anual">("mensal");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar logado para assinar.");
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      setUserId(decoded.id);
    } catch (error) {
      console.error("Erro ao decodificar token:", error);
      alert("Sessão inválida. Faça login novamente.");
      navigate("/login");
    }
  }, [navigate]);

  const handleSubscribe = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${import.meta.env.VITE_API_URL}/signature`,
        { user_id: userId, plan },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await axios.post(
        `${import.meta.env.VITE_API_URL}/users/${userId}/subscribe`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Assinatura realizada com sucesso! Você agora é um organizador.");
      navigate("/home");
    } catch (error) {
      console.error("Erro ao assinar:", error);
      alert("Erro ao assinar. Tente novamente.");
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
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value as "mensal" | "anual")}
            className="signature-select"
          >
            <option value="mensal">Mensal - R$ 19,90</option>
            <option value="anual">Anual - R$ 199,90 (Economize 16%)</option>
          </select>
        </div>

        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="signature-button"
        >
          {loading ? "Processando..." : "Assinar agora"}
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
      </div>
    </div>
  );
};

export default SignaturePage;
