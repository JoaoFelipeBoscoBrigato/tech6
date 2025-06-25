import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { api } from '../api/api';
import './EventDetails.css';
import React from 'react';

interface Participant {
  user: {
    id: number;
    name: string;
  };
}

interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
  location: string;
  image_url: string | null;
  organizer?: {
    id: number;
    name: string;
    avatar_url: string | null;
  };
}

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [participating, setParticipating] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [registrationError, setRegistrationError] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const userType = localStorage.getItem('userType');
  const token = localStorage.getItem('token');
  const [editMode, setEditMode] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
  });

  // Função para buscar participantes
  const fetchParticipants = async () => {
    if (userType === 'organizador' && token) {
      try {
        const response = await api.get<Participant[]>(
          `/events/${id}/participants`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setParticipants(response.data);
      } catch (err) {
        console.error('Erro ao buscar participantes:', err);
      }
    }
  };

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get<Event>(
          `http://localhost/api/events/${id}`
        );
        setEvent(response.data);
      } catch (err) {
        console.error('Erro ao carregar evento:', err);
        setError(
          'Erro ao carregar detalhes do evento. Por favor, tente novamente mais tarde.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
    fetchParticipants();
  }, [id, userType, token]);

  useEffect(() => {
    if (event) {
      setEditForm({
        name: event.name,
        description: event.description,
        date: event.date.slice(0, 10),
        location: event.location,
      });
    }
  }, [event]);

  const handleParticipate = async () => {
    if (!event) return;

    try {
      setParticipating(true);
      setRegistrationError('');

      // Obter o token do localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        setRegistrationError(
          'Você precisa estar logado para participar do evento.'
        );
        return;
      }

      // Fazer a chamada para a API de registro
      await axios.post(
        `http://localhost/api/events/${id}/register`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Inscrição realizada com sucesso!');
      // Atualizar o estado do evento para refletir a nova inscrição
      const updatedEvent = await axios.get<Event>(
        `http://localhost/api/events/${id}`
      );
      setEvent(updatedEvent.data);
      // Atualizar a lista de participantes automaticamente
      await fetchParticipants();
    } catch (err: unknown) {
      console.error('Erro ao participar do evento:', err);
      if (err && typeof err === 'object' && 'response' in err) {
        const errorResponse = err as { response?: { status: number } };
        if (errorResponse.response?.status === 401) {
          setRegistrationError(
            'Você precisa estar logado para participar do evento.'
          );
        } else if (errorResponse.response?.status === 409) {
          setRegistrationError('Você já está inscrito neste evento.');
        } else {
          setRegistrationError(
            'Erro ao participar do evento. Por favor, tente novamente.'
          );
        }
      } else {
        setRegistrationError(
          'Erro ao participar do evento. Por favor, tente novamente.'
        );
      }
    } finally {
      setParticipating(false);
    }
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdateEvent = async () => {
    if (!event) return;
    try {
      await axios.put(`http://localhost/api/events/${event.id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditMode(false);
      setEvent({ ...event, ...editForm });
    } catch (err) {
      setRegistrationError('Erro ao atualizar evento.');
    }
  };

  const handleDeleteEvent = async () => {
    if (!event) return;
    try {
      await axios.delete(`http://localhost/api/events/${event.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteDialog(false);
      navigate('/home');
    } catch (err) {
      setRegistrationError('Erro ao excluir evento.');
    }
  };

  if (loading) {
    return (
      <div className="event-details-container">
        <div className="event-details-content">
          <div className="event-details-info">
            <div className="event-details-loading">
              <div className="event-details-loading-spinner"></div>
              <p>Carregando detalhes do evento...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="event-details-container">
        <div className="event-details-content">
          <div className="event-details-info">
            <div className="event-details-error">
              <svg
                className="event-details-error-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p>{error || 'Evento não encontrado'}</p>
              <button
                onClick={() => navigate('/home')}
                className="event-details-button event-details-button-primary"
              >
                Voltar para Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(event.date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Construir a URL completa da imagem
  const imageUrl = event.image_url
    ? `http://localhost/api${event.image_url}`
    : null;

  return (
    <div className="event-details-container">
      <div className="event-details-content">
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={event.name}
            className="event-details-image"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="event-details-image-placeholder">
            <svg
              className="event-details-image-placeholder-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        <div className="event-details-info">
          <h1 className="event-details-title" data-cy="event-title">
            {event.name}
          </h1>

          <div className="event-details-meta">
            <div className="event-details-meta-item" data-cy="event-date">
              <svg
                className="event-details-meta-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {formattedDate}
            </div>
            <div className="event-details-meta-item" data-cy="event-location">
              <svg
                className="event-details-meta-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {event.location}
            </div>
          </div>

          <div className="event-details-description-container">
            <h3 className="event-details-description-title">Sobre o Evento</h3>
            <p
              className="event-details-description"
              data-cy="event-description"
            >
              {event.description}
            </p>
          </div>

          {event.organizer && (
            <div className="event-details-organizer">
              <h3 className="event-details-organizer-title">Organizador</h3>
              <div className="event-details-organizer-info">
                {event.organizer.avatar_url ? (
                  <img
                    src={`http://localhost/api${event.organizer.avatar_url}`}
                    alt={event.organizer.name}
                    className="event-details-organizer-avatar"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : (
                  <div className="event-details-organizer-avatar">
                    {event.organizer.name.charAt(0)}
                  </div>
                )}
                <span className="event-details-organizer-name">
                  {event.organizer.name}
                </span>
              </div>
            </div>
          )}

          <div className="event-details-actions">
            <button
              onClick={() => navigate('/home')}
              className="event-details-button event-details-button-secondary"
              data-cy="back-button"
            >
              Voltar
            </button>
            <button
              onClick={handleParticipate}
              className="event-details-button event-details-button-primary"
              disabled={participating}
              data-cy="participate-button"
            >
              {participating ? 'Participando...' : 'Participar do Evento'}
            </button>
            {userType === 'organizador' && (
              <>
                <button
                  className="event-details-button event-details-button-edit"
                  data-cy="edit-event-button"
                  onClick={() => setEditMode(true)}
                >
                  Editar
                </button>
                <button
                  className="event-details-button event-details-button-delete"
                  data-cy="delete-event-button"
                  onClick={() => setDeleteDialog(true)}
                >
                  Excluir
                </button>
              </>
            )}
          </div>

          {registrationError && (
            <div
              className="event-details-error-message"
              data-cy="error-message"
            >
              {registrationError}
            </div>
          )}
        </div>
      </div>

      {userType === 'organizador' && participants.length > 0 && (
        <div className="participants-card">
          <h3 className="participants-title">Participantes Inscritos</h3>
          <ul className="participants-list">
            {participants.map((p) => (
              <li key={p.user.id} className="participant-item">
                {p.user.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {editMode && (
        <div className="event-edit-modal">
          <div>
            <h2>Editar Evento</h2>
            <div className="form-group">
              <label htmlFor="name">Nome do Evento</label>
              <input
                type="text"
                id="name"
                name="name"
                value={editForm.name}
                onChange={handleEditChange}
                placeholder="Digite o nome do evento"
                data-cy="title-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Descrição</label>
              <textarea
                id="description"
                name="description"
                value={editForm.description}
                onChange={handleEditChange}
                placeholder="Descreva o evento"
                data-cy="description-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="date">Data</label>
              <input
                type="date"
                id="date"
                name="date"
                value={editForm.date}
                onChange={handleEditChange}
                data-cy="date-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="location">Localização</label>
              <input
                type="text"
                id="location"
                name="location"
                value={editForm.location}
                onChange={handleEditChange}
                placeholder="Digite o local do evento"
                data-cy="location-input"
              />
            </div>
            <div className="button-group">
              <button
                onClick={() => setEditMode(false)}
                className="event-details-button event-details-button-secondary"
                data-cy="cancel-edit-button"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateEvent}
                className="event-details-button event-details-button-primary"
                data-cy="update-event-button"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}
      {deleteDialog && (
        <div className="event-delete-modal">
          <div>
            <p>Tem certeza que deseja excluir este evento?</p>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                marginTop: '0.5rem',
              }}
            >
              Esta ação não pode ser desfeita.
            </p>
            <div className="button-group">
              <button
                onClick={() => setDeleteDialog(false)}
                className="event-details-button event-details-button-secondary"
                data-cy="cancel-delete-button"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteEvent}
                className="event-details-button event-details-button-delete"
                data-cy="confirm-delete-button"
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
