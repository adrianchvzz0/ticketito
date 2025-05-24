import Footer from "../components/Footer";
import Header from "../components/HeaderEvents";
import { useState } from "react";


export default function PolicyPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCity, setSelectedCity] = useState("");


    return (
        <div className="min-h-screen bg-BackgroundBlue text-white font-sans items-center">
            <Header
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCity={selectedCity}
                setSelectedCity={setSelectedCity}
                filteredEvents={[]}
            />

            <div className="w-full px-12 py-12 mt-20 flex flex-col">
                <h1 className="text-3xl font-bold text-left mb-6">
                    Términos y Condiciones de Ticketito
                </h1>

                <p className="text-base">
                    Bienvenido a Ticketito. <br />
                    Al utilizar nuestro sitio web y servicios, aceptas los siguientes
                    términos y condiciones. Te recomendamos leerlos detenidamente antes de
                    realizar cualquier compra.
                </p>

                <div className=" border-t border-gray-500 my-6"></div>
                <div className="max-w-5xl">
                    <h6 className="text-base font-semibold mb-2">1. Uso del Sitio Web</h6>
                    <ul className="text-base list-disc pl-6 space-y-2">
                        <li>
                            <span className="font-semibold">Acceso y Uso:</span> El acceso a
                            nuestro sitio es exclusivamente para uso comercial. No está permitido
                            modificar, reproducir, duplicar, copiar, vender, revender o explotar
                            cualquier parte del sitio sin nuestro consentimiento expreso por
                            escrito.
                        </li>
                        <li>
                            <span className="font-semibold">Conducta del Usuario:</span> Te
                            comprometes a no utilizar el sitio para fines ilegales o no
                            autorizados. Esto incluye, pero no se limita a, la reventa no
                            autorizada de boletos, el uso de bots o cualquier otro método
                            automatizado para acceder al sitio.
                        </li>
                    </ul>

                    <h6 className="text-base font-semibold mt-6 mb-2">2. Registro y Cuenta</h6>
                    <ul className="text-base list-disc pl-6 space-y-2">
                        <li>
                            <span className="font-semibold">Información Personal:</span> Para
                            realizar compras, es necesario crear una cuenta proporcionando
                            información veraz y completa. Eres responsable de mantener la
                            confidencialidad de tu contraseña y de todas las actividades que
                            ocurran bajo tu cuenta.
                        </li>
                        <li>
                            <span className="font-semibold">Actualización de Información:</span>{" "}
                            Es tu responsabilidad mantener actualizada la información de tu
                            cuenta. Ticketito no se hace responsable por problemas derivados de
                            información desactualizada o incorrecta.
                        </li>
                    </ul>

                    <h6 className="text-base font-semibold mt-6 mb-2">3. Compra de Boletos</h6>
                    <ul className="text-base list-disc pl-6 space-y-2">
                        <li>
                            <span className="font-semibold">Disponibilidad:</span> Todos los
                            boletos están sujetos a disponibilidad. Ticketito no garantiza la
                            disponibilidad de boletos hasta que la compra haya sido confirmada.
                        </li>
                        <li>
                            <span className="font-semibold">Precios y Cargos:</span> Los precios
                            de los boletos incluyen impuestos aplicables. Además del precio del
                            boleto, se pueden aplicar cargos por servicio y cargos por entrega,
                            los cuales se detallarán durante el proceso de compra.
                        </li>
                        <li>
                            <span className="font-semibold">Límite de Boletos:</span> El número de
                            boletos que una persona puede comprar para un evento puede estar
                            limitado. Si se excede este límite, Ticketito se reserva el derecho
                            de cancelar las compras excedentes sin previo aviso.
                        </li>
                    </ul>

                    <h6 className="text-base font-semibold mt-6 mb-2">4. Entrega de Boletos</h6>
                    <ul className="text-base list-disc pl-6 space-y-2">
                        <li>
                            <span className="font-semibold">Métodos de Entrega:</span> Ofrecemos
                            diferentes métodos de entrega, incluyendo boletos electrónicos y
                            físicos. Las opciones disponibles se mostrarán durante el proceso de
                            compra.
                        </li>
                        <li>
                            <span className="font-semibold">Recolección en Punto de Venta:</span>{" "}
                            Si eliges recoger tus boletos en un punto de venta, deberás presentar
                            una identificación oficial y la tarjeta de crédito utilizada para la
                            compra.
                        </li>
                    </ul>
                </div>
            </div>

            <Footer />
        </div>
    );
}
