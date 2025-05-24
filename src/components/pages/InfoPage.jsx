import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../index.css";
import Footer from "../components/Footer";
import { Calendar } from "lucide-react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Header from "../components/HeaderEvents";
import Button from "../components/Button";


function InfoPage() {
  const { eventId } = useParams(); // Obtiene el ID desde la URL
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const seatSelectionRef = useRef(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);


  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/events/${eventId}`)
      .then((response) => {
        setEvent(response.data);
        setTotalPrice(ticketQuantity * (response.data.prices[selectedZone] || 0));
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [eventId, selectedZone, ticketQuantity]);



  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleZoneChange = (e) => setSelectedZone(e.target.value);
  const handleDateChange = (e) => setSelectedDate(e.target.value);
  const handleQuantityChange = (e) => setTicketQuantity(Number(e.target.value));
  const handlePurchaseClick = () => {
    seatSelectionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  //onClick={() => navigate('/payment', { state: { eventId, amount: totalPrice, eventName: event.title } })}
  //disabled={totalPrice <= 0}

  const handleContinue = async () => {
    if (!user) {
      alert("Debes iniciar sesión para continuar con la compra.");
      navigate("/login");
      return;
    }
    console.log("Procediendo con la compra...");

    const purchaseData = {
      userId: user.uid,
      userEmail: user.email,
      purchaseDate: new Date().toISOString(),
      eventDetails: {
        title: event.title,
        location: event.palco,
        date: selectedDate,
        zone: selectedZone,
        quantity: ticketQuantity
      },
      total: totalPrice
    };
    console.log("Datos enviados:", JSON.stringify(purchaseData, null, 2));

    console.log("Datos enviados:", purchaseData);




    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/upload/purchase`, purchaseData);
      // Redirigir a Stripe Payment
      navigate('/payment', { state: { eventId, amount: totalPrice, eventName: event.title } });
      // navigate("/success"); // Redirige a una pantalla de éxito
    } catch (error) {
      console.error("Error al registrar la compra:", error);
      alert("Hubo un error al realizar la compra. Intenta nuevamente.");
    }
  };


  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-BackgroundBlue">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-PrimaryGreen mb-4"></div>
      <span className="text-white text-lg">Cargando evento...</span>
    </div>
  );
  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-BackgroundBlue">
      <div className="bg-red-100 border border-red-400 text-red-700 px-8 py-6 rounded-xl shadow-lg">
        <h2 className="font-bold text-2xl mb-2">¡Ups! Ocurrió un error</h2>
        <p className="text-lg">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 bg-PrimaryGreen text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">Reintentar</button>
      </div>
    </div>
  );
  if (!event) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-BackgroundBlue">
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-8 py-6 rounded-xl shadow-lg">
        <h2 className="font-bold text-2xl mb-2">Evento no encontrado</h2>
        <p className="text-lg">El evento solicitado no fue encontrado.</p>
        <Link to="/" className="mt-4 bg-PrimaryGreen text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">Volver al inicio</Link>
      </div>
    </div>
  );


  return (
    <div className="bg-BackgroundBlue min-h-screen text-white font-sans">
      <div className="h-20"></div>
      <Header />

      <div className="w-full felx py-8 px-20">
        <div className="mx-auto py-8 px-20">

          {/* Contenedor con fondo borroso */}
          <div className="relative max-h-fit flex flex-col md:flex-row gap-8 items-start p-6 rounded-2xl overflow-hidden" >
            {/* Imagen de fondo borrosa */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-lg opacity-40"
              style={{ backgroundImage: `url(${event.image})` }}
            ></div>
            {/* Contenido del evento (por encima del fondo borroso) */}
            <div className="relative flex items-start gap-24 bg-BackgroundBlueDark bg-opacity-90 p-10 rounded-2xl w-full">
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
                <Button
                  variant="primary"
                  onClick={(handlePurchaseClick)}
                >
                  Comprar boleto
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="my-8">
          <div className="flex gap-4 items-center justify-center">
            <img
              src={require("../../assets/tarjeta_icon.png")}
              alt="icono tarjeta"
              className="w-auto h-5 mb-4 "
            />

            <h2 className="text-xl font-bold mb-4">Métodos de Pago</h2>
          </div>

          <div className="flex justify-center items-center gap-4">
            <img
              src={require("../../assets/VISA_logo.png")}
              alt="VISA"
              className="w-auto h-4"
            />
            <img
              src={require("../../assets/mastercard_logo.png")}
              alt="MasterCard"
              className="w-auto h-4"
            />
          </div>
          <div className="border-t bg-gray-500 m-4">
          </div>
        </div>

        <div className=" bg-Background p-6 rounded-3xl">
          <h2 className="text-xl font-bold mb-4">Detalles del Evento</h2>
          <div className="my-2 max-w-40 h-0.5 rounded-xl bg-gradient-to-r from-PrimaryGreen to-BackgroundBlue"></div>

          <div className="grid grid-cols-2 gap-10">
            {/* Columna 1 */}
            <div>
              <p className="text-s text-gray-400">{event.details}</p>
            </div>

            {/* Columna 2 */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Atención:</h3>
              <div className="my-2 max-w-40 h-0.5 rounded-xl bg-gradient-to-r from-PrimaryGreen to-BackgroundBlue"></div>
              <ul className="list-disc pl-6 text-gray-400">
                <li>No se permite cámaras ni video.</li>
                <li>Niños pagan a partir de 2 años.</li>
                <li>Apertura de puertas 2 horas antes del evento.</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex items-center text-center justify-center p-4 bg-BackgroundBlueDark rounded-xl">
          <div ref={seatSelectionRef} className="my-8">
            <h2 className="text-xl font-bold mb-4 text-PrimaryGreen">Selecciona tu Zona</h2>
            <label className="block text-left text-white font-semibold mb-2 mt-2" htmlFor="zone">Zona</label>
            <select
              id="zone"
              value={selectedZone}
              onChange={handleZoneChange}
              className={`max-w-80 px-4 py-2 bg-BackgroundBlueDark border-2 focus:border-PrimaryGreen border-gray-600 outline-none rounded-lg text-white transition-all duration-200 shadow-sm ${!selectedZone && 'border-red-500 animate-pulse'}`}
              required
            >
              <option value="" disabled>Selecciona una zona</option>
              <option value="VIP">Zona VIP</option>
              <option value="Preferente">Zona Preferente</option>
              <option value="General">Zona General</option>
            </select>

            <label className="block text-left text-white font-semibold mb-2 mt-4" htmlFor="date">Fecha</label>
            <div className="relative">
              <input
                id="date"
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className={`max-w-80 px-4 py-2 bg-BackgroundBlueDark border-2 focus:border-PrimaryGreen border-gray-600 outline-none rounded-lg text-white pr-10 transition-all duration-200 shadow-sm ${!selectedDate && 'border-red-500 animate-pulse'}`}
                required
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-PrimaryGreen cursor-pointer" />
            </div>

            <label className="block text-left text-white font-semibold mb-2 mt-4" htmlFor="quantity">Cantidad de Boletos</label>
            <input
              id="quantity"
              type="number"
              min="1"
              value={ticketQuantity}
              onChange={handleQuantityChange}
              className="max-w-80 px-4 py-2 bg-BackgroundBlueDark border-2 focus:border-PrimaryGreen border-gray-600 outline-none rounded-lg text-white transition-all duration-200 shadow-sm"
              required
            />

            {selectedZone && selectedDate && (
              <p className="mt-4 text-lg text-green-400 bg-gray-900 bg-opacity-50 px-4 py-2 rounded-xl shadow">Total a pagar: <strong>${totalPrice.toLocaleString()}</strong></p>
            )}

            <button
              onClick={handleContinue}
              className={`w-full mt-6 py-3 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-PrimaryGreen focus:ring-offset-2 ${(!selectedZone || !selectedDate) ? 'bg-gray-400 cursor-not-allowed' : 'bg-PrimaryGreen hover:bg-green-700 text-white'}`}
              disabled={!selectedZone || !selectedDate}
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div >
  );
}

export default InfoPage;
