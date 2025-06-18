import { Link } from "react-router-dom";
import { useState } from "react";
import { FaInstagram, FaFacebookF, FaEnvelope, FaTiktok } from "react-icons/fa";


const Footer = () => {
    return (
        <footer className="bg-BackgroundBlueDark text-white py-6">
            <div className="container mx-auto px-4 text-center">
                {/* Redes Sociales */}
                <div className="flex justify-center space-x-6 mb-4">
                    <a className="text-xl hover:text-gray-400">
                        <FaInstagram />
                    </a>
                    <a className="text-xl hover:text-gray-400">
                        <FaFacebookF />
                    </a>
                    <a className="text-xl hover:text-gray-400">
                        <FaEnvelope />
                    </a>
                    <a className="text-xl hover:text-gray-400">
                        <FaTiktok />
                    </a>
                </div>

                {/* Línea divisoria */}
                <div className="w-1/4 mx-auto border-t border-gray-500 mb-4"></div>

                {/* Enlaces */}
                <div className="flex justify-center space-x-8 text-sm font-semibold">
                    <a className="hover:text-gray-400">Preguntas Frecuentes</a>
                    <Link to='/about'>
                        <p className="hover:text-gray-400">Nosotros</p>
                    </Link>
                    <Link to='/policy'>
                        <p className="hover:text-gray-400">Términos y Condiciones</p>
                    </Link>
                </div>

                {/* Copyright */}
                <p className="text-sm mt-4">&copy; 2025 Ticketito. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
};

export default Footer;