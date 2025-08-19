import { useState } from "react";
import { UserCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../firebase/authContext";
// Importación correcta de imágenes


const ciudades = [
    "Monterrey",
    "San Pedro Garza García",
    "San Nicolás de los Garza",
    "Guadalupe",
];

const Header = ({ selectedCity, setSelectedCity, searchTerm, setSearchTerm, filteredEvents, handleSelectEvent }) => {
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);


    return (
        <header className="bg-gradient-to-r from-gradientBlue via-gradientGreen to-GreenDark p-6 flex justify-between items-center shadow-2xl font-sans mb-10">
            {/* Logo */}
            <Link to="/">
                <img src="/logoTicketito.webp" alt="logoTicketito" className="w-auto h-12" />
            </Link>

            {/* Selector de ciudad */}
            <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-2 py-2 rounded-md text-black text-xs"
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

            {/* Barra de búsqueda */}
            <div className="relative w-1/3">
                <input
                    type="text"
                    placeholder="Busca artista, ciudad, evento..."
                    className="px-4 py-2 rounded-md text-black w-full"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowDropdown(true);
                    }}
                />

                {/* Resultados de la búsqueda */}
                {showDropdown && searchTerm && filteredEvents.length > 0 && (
                    <ul
                        className="absolute top-full left-0 w-full bg-white text-black rounded-md shadow-md max-h-40 overflow-y-auto z-10"
                        onMouseDown={(e) => e.preventDefault()} // Evita que el blur cierre el menú
                    >
                        {filteredEvents.map((event) => (
                            <li
                                key={event.id}
                                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                onClick={() => handleSelectEvent(event.title)}
                            >
                                <Link to={`/info/${event.id}`}>{event.title}</Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Perfil o botón de login */}
            {user ? (
                <div className="relative">
                    <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center space-x-2">
                        <UserCircle size={36} color="#84D7B0" />
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-BackgroundBlue text-white rounded-lg shadow-lg overflow-hidden">
                            <Link to="/profile" className="block px-4 py-2 hover:bg-gray-700">
                                Perfil
                            </Link>
                            <button onClick={logout} className="w-full text-left px-4 py-2 hover:bg-gray-700">
                                Cerrar sesión
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <Link to="/login">
                    <button className="bg-button-default text-white px-4 py-2 rounded-xl shadow-md">
                        Iniciar Sesión
                    </button>
                </Link>
            )}
        </header>
    );
};

export default Header
