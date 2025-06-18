import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "../../index.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../firebase/authContext";
import CategoryFilter from "../components/CategoryFilter";
import Footer from "../components/Footer";
import Header from "../components/HeaderEvents";


export default function HomePage() {
  const { logout } = useAuth();
  const [events, setEvents] = useState([]); // Estado para los eventos
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCity, setSelectedCity] = useState("");
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error
  const [menuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("TODOS");


  // Obtener eventos desde la API cuando el componente se monta
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/events`) // URL del servidor
      .then((response) => {
        setEvents(response.data); // Almacenar los eventos en el estado
        setLoading(false); // Dejar de mostrar el estado de carga
      })
      .catch((error) => {
        setError(error.message); // Si hay error, mostrar mensaje
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, 5000);


    return () => clearInterval(interval);// Limpiar intervalo al desmontar
  }, [events.length]);

  // Filtrar eventos por ciudad, búsqueda y categoría
  const filteredEvents = events.filter((event) => {
    const matchesCity = !selectedCity || event.location === selectedCity;
    const matchesCategory = selectedCategory === "TODOS" || event.category === selectedCategory;
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.palco.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCity && matchesCategory && matchesSearch;
  });
  console.log("Eventos filtrados:", filteredEvents);


  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === events.length - 1 ? 0 : prev + 1));
  };


  const handleCategoryChange = (category) => {
    console.log("Categoría actualizada en HomePage:", category);
    setSelectedCategory(category);
  };


  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-BackgroundBlue">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-PrimaryGreen mb-4"></div>
      <span className="text-white text-lg">Cargando evento...</span>
    </div>
  );

  if (error) {
    return <div>Error: {error}</div>; // Se muestra mensaje de error en caso de haberlo
  }


  return (
    <div className="min-h-screen bg-BackgroundBlue text-white sans-serif">
      {/* Espacio para el header fijo */}
      <div className="h-20"></div>
      {/* Navbar */}
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        filteredEvents={filteredEvents}
        handleSelectEvent={(title) => setSearchTerm(title)}
      />


      {menuOpen && (
        <div className="fixed top-16 right-4 w-48 bg-white text-black rounded-lg shadow-lg overflow-hidden z-50">
          <Link to="/profile" className="block px-4 py-2 hover:bg-gray-200">
            Perfil
          </Link>
          <button
            onClick={logout}
            className="w-full text-left px-4 py-2 hover:bg-gray-200"
          >
            Cerrar sesión
          </button>
        </div>
      )}

      {/* Carrusel */}
      <div className="relative w-full bg-BackgroundGray rounded-b-3xl shadow-2xl items-center flex">
        <button
          onClick={prevSlide}
          className="text-green-200 p-2 rounded-full hover:bg-green-100/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-300 absolute left-4 md:left-12 z-10"
        >
          <ChevronLeft size={38} />
        </button>

        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 rounded-lg flex items-center justify-between w-full max-h-48 max-w-5xl mx-auto my-20 gap-x-10"
        >

          <div className="flex items-center justify-between w-full max-h-40 max-w-5xl mx-auto my-20 gap-x-10">
            <div className="flex-1 text-left">
              <h3 className="text-lg text-gray-400">{events[currentIndex].palco}</h3>
              <h3 className="text-lg text-green-300">{events[currentIndex].location}</h3>
              <h2 className="text-3xl font-extrabold">{events[currentIndex].title}</h2>
              <h3 className="text-lg text-gray-400">{events[currentIndex].date}</h3>
              {/* Enlace para redirigir a la página de información */}
              <Link to={`/info/${events[currentIndex].id}`}>
                <button className="mt-4 bg-button-default text-white px-10 py-1 rounded-lg sans-serif font-bold shadow-2xl hover:scale-110 transition">
                  Detalles
                </button>
              </Link>
            </div>

            <div className="flex-1 flex justify-center">
              <img
                src={events[currentIndex].image}
                alt={events[currentIndex].title}
                className="w-full h-50 object-cover mt-4 shadow-BackgroundBlueDark shadow-xl rounded-3xl "
              />
            </div>
          </div>

        </motion.div>
        <button
          onClick={nextSlide}
          className="text-green-200 p-2 rounded-full hover:bg-green-100/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-300 absolute right-4 md:right-12 z-10"
        >
          <ChevronRight size={38} />
        </button>


      </div>

      {/* Indicadores de Slide */}
      <div className="flex items-center justify-center mt-4 space-x-2">
        {events.slice(0, 8).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 w-11 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-PrimaryGreen scale-110" : "bg-BackgroundGray"
              }`}
          ></button>
        ))}
        {events.length > 8 && (
          <span className="text-sm text-BackgroundGray">...</span>
        )}
      </div>

      <div className="max-w-fit mx-10">

        {/* Eventos Recomendados */}
        <div className="max-w-7xl mx-12 px-4 mt-8">
          <h2 className="text-2xl font-bold mb-3">Eventos Recomendados</h2>
        </div>

        {/* Filtro de Categorías */}
        <div className="mx-14 mb-14">
          <CategoryFilter onSelectCategory={handleCategoryChange} />
        </div>

        {/* Verifica si hay eventos que cumplen con todos los filtros */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 rounded-2xl">
            {filteredEvents.map((event, index) => (
              <Link to={`/info/${event.id}`} key={index}>
                <div className="bg-BackgroundEvents p-4 rounded-2xl min-h-60 max-h-60 hover:scale-105 transition-all duration-300">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-28 object-cover rounded-2xl shadow-lg"
                  />
                  <div className="mt-4">
                    <h3 className="text-gray-400 text-sm">{event.palco}</h3>
                    <h3 className="text-PrimaryGreen">{event.location}</h3>
                    <h2 className="text-sm font-bold">{event.title}</h2>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center font-semibold text-gray-500 p-10 m-32 items-center">No se encontraron eventos con los filtros seleccionados.</p>
        )}

      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
}
