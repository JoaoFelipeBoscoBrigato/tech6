import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import EventCard from "../components/EventCard";
import "./Home.css";

interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
  location: string;
  image_url: string | null;
}

export default function Home() {
  const [userType, setUserType] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const type = localStorage.getItem("userType");
    setUserType(type);
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:3000/events");
      setEvents(response.data);
    } catch (err) {
      setError("Erro ao carregar eventos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = () => {
    navigate("/criar-evento");
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="flex flex-col items-center space-y-4">
          <div className="loading-spinner"></div>
          <p className="loading-text">Carregando eventos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <p className="error-message">{error}</p>
          <button onClick={fetchEvents} className="retry-button">
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-content">
          <Link to="/" className="navbar-logo">
            <img
              src="/images/logo.png"
              alt="Aevum Logo"
              className="logo-image"
            />
          </Link>
          <div className="navigation-buttons">
            <Link to="/login" className="nav-button login-button">
              Login
            </Link>
            <Link to="/register" className="nav-button register-button">
              Registrar
            </Link>
            <Link to="/signature" className="nav-button subscription-button">
              Assinatura
            </Link>
          </div>
        </div>
      </nav>

      <div className="home-container">
        <div className="home-content">
          <div className="home-header">
            <div className="home-title-container">
              <h1 className="home-title">Eventos Disponíveis</h1>
              <p className="home-subtitle">
                Descubra os melhores eventos para você
              </p>
            </div>
            {userType === "organizador" && (
              <button
                onClick={handleCreateEvent}
                className="create-event-button"
              >
                Criar Evento
              </button>
            )}
          </div>

          {events.length === 0 ? (
            <div className="no-events-container">
              <svg
                className="no-events-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="no-events-title">Nenhum evento disponível</h3>
              <p className="no-events-message">
                Não há eventos cadastrados no momento.
              </p>
            </div>
          ) : (
            <div className="events-grid">
              {events.map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
