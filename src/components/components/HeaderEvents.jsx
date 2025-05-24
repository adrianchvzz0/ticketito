import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { UserCircle } from "lucide-react";
import { useAuth } from "../../firebase/authContext";
import axios from "axios";

export default function Header({ selectedCity, setSelectedCity }) {
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [scrollPosition, setScrollPosition] = useState(0);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/events`)
            .then((response) => {
                console.log("Eventos obtenidos:", response.data);
                setEvents(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error al obtener eventos:", error);
                setError(error.message);
                setLoading(false);
            });
    }, []);

    const ciudades = [
        "Monterrey",
        "San Pedro Garza García",
        "San Nicolás de los Garza",
        "Guadalupe",
    ];

    const filteredEvents = events.filter((event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.palco.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCityChange = (e) => {
        setSelectedCity(e.target.value);
    };
    const handleSelectEvent = (eventTitle) => {
        setSearchTerm(eventTitle);
        setShowDropdown(false);
    };

    return (
        <header className="fixed top-0 w-full z-50 sans-serif">
            <div className="absolute inset-0 bg-gradient-to-r from-gradientBlue via-gradientGreen to-GreenDark"
                style={{
                    opacity: `${1 - Math.min(scrollPosition / 250, 1)}`,
                    transition: 'opacity 0.2s ease-out'
                }}
            />
            <div className="relative z-10 p-4 flex justify-between items-center"
                style={{
                    backdropFilter: `blur(${Math.min(scrollPosition / 250 * 10, 10)}px)`
                }}
            >
                <Link to="/">
                    <img src={require("../../assets/logoTicketito.png")} alt="logoTicketito" className="w-auto h-12" />
                </Link>

                <select
                    value={selectedCity}
                    onChange={handleCityChange}
                    className="px-2 py-2 rounded-md text-black w-55 text-xs"
                >
                    <option value="" disabled>Selecciona una ciudad</option>
                    {ciudades.map((ciudad, index) => (
                        <option key={index} value={ciudad}>{ciudad}</option>
                    ))}
                </select>

                <div className="relative w-1/3">
                    <input
                        type="text"
                        placeholder="Busca artista, ciudad, evento..."
                        className="px-4 py-2 rounded-2xl text-black w-full"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setShowDropdown(true);
                        }}
                        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                    />

                    {showDropdown && searchTerm && filteredEvents.length > 0 && (
                        <ul className="absolute top-full left-0 w-full bg-white text-black rounded-md shadow-md max-h-40 overflow-y-auto z-10">
                            {filteredEvents.map((event) => (
                                <li
                                    key={event.id}
                                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                >
                                    <Link
                                        to={`/info/${event.id}`}
                                        onClick={() => handleSelectEvent(event.title)}
                                    >
                                        {event.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {user ? (
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="flex items-center space-x-2 rounded-2xl hover:bg-button-hover active:bg-button-pressed px-2 py-1 transition-all duration-200"
                            aria-expanded={menuOpen}
                            aria-haspopup="true"
                        >
                            <UserCircle size={36} color="#84D7B0" />
                            {user.displayName && (
                                <span className="text-white font-bold">{user.displayName}</span>
                            )}
                        </button>
                        <div className={`absolute right-0 mt-2 w-48 bg-BackgroundBlue text-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-200 ease-in-out z-[9999] ${menuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                            }`}>
                            <div className="py-2">
                                <Link
                                    to="/profile"
                                    className="flex px-4 py-2 text-sm hover:bg-opacity-10 hover:bg-white transition-colors duration-150 items-center space-x-2"
                                >
                                    <UserCircle size={20} />
                                    <span>Perfil</span>
                                </Link>
                                <button
                                    onClick={logout}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-opacity-10 hover:bg-white transition-colors duration-150 flex items-center space-x-2 text-red-300"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3zm11 4.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L11.586 7H6a1 1 0 1 1 0-2h5.586L8.293 1.707a1 1 0 0 1 1.414-1.414L14 4.586v2.828z" clipRule="evenodd" />
                                    </svg>
                                    <span>Cerrar sesión</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Link to="/login">
                        <button className="bg-button-default text-white px-6 py-2 rounded-xl shadow-md hover:bg-opacity-90 transition-all duration-200 flex items-center space-x-2">
                            <UserCircle size={20} />
                            <span>Iniciar Sesión</span>
                        </button>
                    </Link>
                )}
            </div>
        </header>
    );
}
