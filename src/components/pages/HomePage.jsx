import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "../../index.css";
import { Link } from "react-router-dom";
import axios from "axios";

const ciudades = [
  "Monterrey",
  "San Pedro Garza García",
  "San Nicolás de los Garza",
  "Guadalupe",
];

export default function HomePage() {
  const [events, setEvents] = useState([]); // Estado para los eventos
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCity, setSelectedCity] = useState("");
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error

  // Obtener eventos desde la API cuando el componente se monta
  useEffect(() => {
    axios
      .get("http://localhost:2000/events") // URL del servidor
      .then((response) => {
        setEvents(response.data); // Almacenar los eventos en el estado
        setLoading(false); // Dejar de mostrar el estado de carga
      })
      .catch((error) => {
        setError(error.message); // Si hay error, mostrar mensaje
        setLoading(false);
      });
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === events.length - 1 ? 0 : prev + 1));
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  if (loading) {
    return <div>Loading...</div>; // Mientras carga, mostramos "Loading..."
  }

  if (error) {
    return <div>Error: {error}</div>; // Se muestra mensaje de error en caso de haberlo
  }

  return (
    <div className="bg-BackgroundBlue min-h-screen text-white">
      {/* Navbar */}
      <header className="bg-gradient-to-r from-gradientBlue via-gradientGreen to-GreenDark p-4 flex justify-between font-sans items-center">
        <Link to="/">
          <button>
            <img
              src={require("../../assets/logoTicketito.png")}
              alt="logoTicketito"
              className="w-auto h-12"
            />
          </button>
        </Link>

        {/* Dropdown de Ciudades */}
        <select
          value={selectedCity}
          onChange={handleCityChange}
          className="px-0 py-2 rounded-md text-black w-55 text-xs"
        >
          <option value="" disabled>
            Selecciona una ciudad
          </option>
          {ciudades.map((ciudad, index) => (
            <option key={index} value={ciudad}>
              {ciudad}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Busca artista, ciudad, evento..."
          className="px-4 py-2 rounded-md text-black w-1/3"
        />

        <Link to="/login">
          <button className="bg-button-default text-white px-4 py-2 rounded-xl shadow-md">
            Iniciar Sesión
          </button>
        </Link>
      </header>


      {/* Mostrar la ciudad seleccionada */}
      {selectedCity && (
        <div className="text-center mt-4">
          <p className="text-lg">
            Resultados en: <strong>{selectedCity}</strong>
          </p>
        </div>
      )}

      {/* Carrusel */}
      <div className="relative w-full mx-1 my-0 justify-between">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 p-6 rounded-lg flex items-center"
        >
          <button onClick={prevSlide} className="text-green-200 p-2">
            <ChevronLeft size={38} />
          </button>
          <div className="flex items-center justify-between w-full max-h-40 max-w-5xl mx-auto my-20 gap-x-10">
            <div className="flex-1 text-left">
              <h3 className="text-lg text-gray-400">{events[currentIndex].palco}</h3>
              <h3 className="text-lg text-green-300">{events[currentIndex].location}</h3>
              <h2 className="text-3xl font-extrabold">{events[currentIndex].title}</h2>
              <h3 className="text-lg text-gray-400">{events[currentIndex].date}</h3>
              {/* Enlace para redirigir a la página de información */}
              <Link to={`/info/${events[currentIndex].id}`}>
                <button className="mt-4 bg-button-default text-white px-10 py-1 rounded-xl sans-serif font-bold shadow-sm hover:scale-110 transition">
                  Detalles
                </button>
              </Link>
            </div>

            <div className="flex-1 flex justify-center">
              <img
                src={events[currentIndex].image}
                alt={events[currentIndex].title}
                className="w-full h-50 object-cover mt-4 rounded-3xl "
              />
            </div>
          </div>
          <button onClick={nextSlide} className="text-green-200 p-2">
            <ChevronRight size={38} />
          </button>
        </motion.div>

        {/* Indicadores de Slide */}
        <div className="flex justify-center mt-4 space-x-2">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)} // Cambia el slide al hacer clic
              className={`h-2 w-14 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-PrimaryGreen scale-110" : "bg-gray-500"
                }`}
            ></button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">

        {/* Eventos Recomendados */}
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-bold mb-4">Eventos Recomendados</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 margin-bottom-5 rounded-2xl">
          {events.map((event, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded-2xl">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-50 object-cover rounded-2xl shadow-lg"
              />
              <h3 className="text-gray-400">{event.palco}</h3>
              <h3 className="text-green-300">{event.location}</h3>
              <h2 className="text-lg font-bold">{event.title}</h2>

              {/* Enlace para redirigir a la página de información */}
              <Link to={`/info/${event.id}`}>
                <button className="mt-4 bg-button-default text-white px-4 py-2 rounded-md sans-serif">
                  Detalles
                </button>
              </Link>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className=" p-4 text-center mt-8">
          <p className="text-white">© 2025 Ticketito. Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  );
}
