import { Link } from "react-router-dom";
import "./EventCard.css";

interface EventCardProps {
  id: number;
  name: string;
  description: string;
  date: string;
  location: string;
  image_url: string | null;
}

export default function EventCard({
  id,
  name,
  description,
  date,
  location,
  image_url,
}: EventCardProps) {
  // Formatar a data para exibição
  const formattedDate = new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <Link to={`/evento/${id}`} className="event-card">
      <div className="event-image-container">
        {image_url ? (
          <img
            src={
              image_url.startsWith("http")
                ? image_url
                : `http://localhost:3000${image_url}`
            }
            alt={name}
            className="event-image"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src =
                "https://via.placeholder.com/300x200?text=Imagem+indisponível";
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-sm">Sem imagem</span>
          </div>
        )}
        <div className="event-image-overlay">
          <h3 className="event-title">{name}</h3>
        </div>
      </div>

      <div className="event-content">
        <p className="event-description">{description}</p>

        <div className="event-info">
          <svg
            className="event-info-icon"
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

        <div className="event-info">
          <svg
            className="event-info-icon"
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
          {location}
        </div>
      </div>
    </Link>
  );
}
