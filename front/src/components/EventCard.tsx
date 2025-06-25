import { Link } from 'react-router-dom';
import './EventCard.css';

interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
  location: string;
  image_url: string | null;
  organizer: {
    name: string;
  };
}

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { id, name, date, location, image_url, organizer } = event;

  const formattedDate = new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Link to={`/evento/${id}`} className="event-card-link" data-cy="event-card">
      <div className="event-card">
        <div className="event-card-image-container">
          {image_url ? (
            <img
              src={`http://localhost:3000${image_url}`}
              alt={name}
              className="event-card-image"
            />
          ) : (
            <div className="event-card-placeholder-image">
              <span>Sem Imagem</span>
            </div>
          )}
        </div>
        <div className="event-card-content">
          <h3 className="event-card-title">{name}</h3>
          <p className="event-card-date">{formattedDate}</p>
          <p className="event-card-location">{location}</p>
          <p className="event-card-organizer">
            Organizado por: <strong>{organizer.name}</strong>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
