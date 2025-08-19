import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/pages/HomePage";
import InfoPage from "./components/pages/InfoPage";
import LoginPage from "./components/pages/LoginPage";
import RegisterPage from "./components/pages/RegisterPage";
import About from "./components/pages/AboutPage";
import { AuthProvider } from "./firebase/authContext";
import PolicyPage from "./components/pages/PolicyPage";
import Profile from "./components/pages/Profile";
import PaymentPage from "./components/pages/PaymentPage";
import AdminEventsPage from "./components/pages/AdminEventsPage";

export default function App() {
  return (
    <AuthProvider>
      <Routes>

        <Route path="/" element={<HomePage />} />

        <Route path="/info/:eventId" element={<InfoPage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route path="/about" element={<About />} />

        <Route path="/policy" element={<PolicyPage />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/payment" element={<PaymentPage />} />

        <Route path="/admin/events" element={<AdminEventsPage />} />
      </Routes>

    </AuthProvider>
  );
}
