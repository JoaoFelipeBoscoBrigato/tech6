import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import EventCard from '../components/EventCard';
import './Home.css';

interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
  location: string;
  image_url: string | null;
<<<<<<< HEAD
  organizer: {
    name: string;
  };
=======
>>>>>>> ed3a751d1602e4f18ae42998c040ef3798320499
}

export default function Home() {
  const [userType, setUserType] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const type = localStorage.getItem('userType');
    setUserType(type);
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
<<<<<<< HEAD
      const response = await axios.get<Event[]>('http://localhost/api/events');
=======
<<<<<<< HEAD
      const response = await axios.get<Event[]>('http://localhost:3000/events');
=======
      const response = await axios.get('http://localhost:3000/events');
>>>>>>> ed3a751d1602e4f18ae42998c040ef3798320499
>>>>>>> a445d2e9df56f365eeb9f0606d86f93e7791b5fd
      setEvents(response.data);
    } catch (err) {
      setError('Erro ao carregar eventos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = () => {
    navigate('/criar-evento');
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
<<<<<<< HEAD
            {!localStorage.getItem('token') ? (
              <>
                <Link to="/login" className="nav-button login-button">
                  Login
                </Link>
                <Link to="/register" className="nav-button register-button">
                  Registrar
                </Link>
              </>
            ) : null}
            <Link to="/signature" className="nav-button subscription-button">
              Assinatura
            </Link>
            {localStorage.getItem('token') && (
              <>
                <Link to="/profile" className="nav-button profile-button">
                  Perfil
                </Link>
                <Link
                  to="/login"
                  onClick={() => {
                    localStorage.clear();
                  }}
                  className="nav-button logout-button"
                  data-cy="logout-button"
                >
                  Logout
                </Link>
              </>
            )}
=======
            <Link to="/login" className="nav-button login-button">
              Login
            </Link>
            <Link to="/register" className="nav-button register-button">
              Registrar
            </Link>
            <Link to="/signature" className="nav-button subscription-button">
              Assinatura
            </Link>
>>>>>>> ed3a751d1602e4f18ae42998c040ef3798320499
          </div>
        </div>
      </nav>

      <div className="home-container">
        <div className="home-content">
<<<<<<< HEAD
          {userType === 'organizador' && (
            <div className="create-event-section">
=======
          <div className="home-header">
            <div className="home-title-container">
              <h1 className="home-title">Eventos Disponíveis</h1>
              <p className="home-subtitle">
                Descubra os melhores eventos para você
              </p>
            </div>
            {userType === 'organizador' && (
>>>>>>> ed3a751d1602e4f18ae42998c040ef3798320499
              <button
                onClick={handleCreateEvent}
                className="create-event-button"
              >
                Criar Evento
              </button>
<<<<<<< HEAD
            </div>
          )}

          <div className="home-title-container">
            <h1 className="home-title">Eventos Disponíveis</h1>
            <p className="home-subtitle">
              Descubra os melhores eventos para você
            </p>
=======
            )}
>>>>>>> ed3a751d1602e4f18ae42998c040ef3798320499
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
<<<<<<< HEAD
                <EventCard key={event.id} event={event} />
=======
                <EventCard key={event.id} {...event} />
>>>>>>> ed3a751d1602e4f18ae42998c040ef3798320499
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
