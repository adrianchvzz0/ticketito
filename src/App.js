import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/pages/HomePage";
import InfoPage from "./components/pages/InfoPage";
import LoginPage from "./components/pages/LoginPage";
import RegisterPage from "./components/pages/RegisterPage";


export default function App() {
  return (
    <Routes>
      {/* Ruta principal */}
      <Route path="/" element={<HomePage />} />

      {/* Ruta para la página de información del evento */}
      <Route path="/info/:eventId" element={<InfoPage />} />


      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />

    </Routes>

  );
}
