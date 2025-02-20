import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "../../index.css";

export default function InfoPage() {
  const { eventId } = useParams(); // Obtiene el ID desde la URL
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedZone, setSelectedZone] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:2000/events/${eventId}`) // Consultar evento específico
      .then((response) => {
        setEvent(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [eventId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!event) return <div>No se encontró el evento</div>;

  const handleZoneChange = (e) => {
    setSelectedZone(e.target.value);
  };

  return (
    <div className="bg-BackgroundBlue min-h-screen text-white font-sans">
      <header className="bg-custom-gradient flex p-2 justify-between items-center">
        <Link to="/">
          <button>
            <img
              src={require("../../assets/logoTicketito.png")}
              alt="logoTicketito"
              className="w-auto h-12"
            />
          </button>
        </Link>
        <Link to="/">
          <button className="btn-default">
            Volver
          </button>
        </Link>
      </header>

      <div className="mx-auto py-8 px-20">
        <div className="mx-auto py-8 px-20">
          {/* Contenedor con fondo borroso */}
          <div
            className="relative flex flex-col md:flex-row gap-8 items-start p-6 rounded-lg overflow-hidden"
          >
            {/* Imagen de fondo borrosa */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-lg opacity-"
              style={{ backgroundImage: `url(${event.image})` }}
            ></div>

            {/* Contenido del evento (por encima del fondo borroso) */}
            <div className="relative flex items-start gap-8 bg-BackgroundGray bg-opacity-90 p-6 rounded-lg">
              <img
                src={event.imageSecondary}
                alt={event.title}
                className="w-full md:w-72 h-auto rounded-lg shadow-xl"
              />
              <div className="flex-1">
                <h3 className="text-lg text-gray-400">{event.palco}</h3>
                <h3 className="text-lg text-green-300">{event.location}</h3>
                <h2 className="text-3xl font-extrabold">{event.title}</h2>
                <h3 className="text-lg text-gray-400">{event.date}</h3>
                <h3 className="text-lg text-gray-400">{event.price}</h3>
                <button className="btn-default">Comprar Boletos</button>
              </div>
            </div>
          </div>
        </div>

        <div className="my-8">
          <h2 className="text-xl font-bold mb-4">Métodos de Pago</h2>
          <div className="flex items-center gap-4">
            <img
              src="https://via.placeholder.com/100x50?text=VISA"
              alt="VISA"
              className="rounded-lg"
            />
            <img
              src="https://via.placeholder.com/100x50?text=MasterCard"
              alt="MasterCard"
              className="rounded-lg"
            />
          </div>
        </div>

        <div className="w-3/5 bg-Background p-6 rounded-3xl">
          <h2 className="text-xl font-bold mb-4">Detalles del Evento</h2>
          <p className="text-s text-gray-400">{event.details}</p>
          <br />
          <h3 className="text-lg font-semibold mb-2">Atención:</h3>
          <ul className="list-disc pl-6 text-gray-400">
            <li>No se permite cámaras ni video.</li>
            <li>Niños pagan a partir de 2 años.</li>
            <li>Apertura de puertas 2 horas antes del evento.</li>
          </ul>
        </div>

        <div className="my-8">
          <h2 className="text-xl font-bold mb-4">Selecciona tu Zona</h2>
          <select
            value={selectedZone}
            onChange={handleZoneChange}
            className="w-full px-4 py-2 rounded-md text-black"
          >
            <option value="" disabled>
              Selecciona una zona
            </option>
            <option value="VIP">Zona VIP - $4,155</option>
            <option value="Preferente">Zona Preferente - $2,577</option>
            <option value="General">Zona General - $577</option>
          </select>

          {selectedZone && (
            <p className="mt-4 text-lg text-green-500">
              Has seleccionado: <strong>{selectedZone}</strong>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
