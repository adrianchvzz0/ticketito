import Header from "../components/HeaderEvents";
import Footer from "../components/Footer";
import { useState } from "react";

export default function InfoPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCity, setSelectedCity] = useState("");

    return (
        <div className='bg-BackgroundBlue  min-h-screen font-sans items-center text-white'>
            <Header
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCity={selectedCity}
                setSelectedCity={setSelectedCity}
                filteredEvents={[]}
            />
            <div className="w-full py-12 px-12 mt-20">
                <h1 className="font-bold text-3xl text-white">
                    Acerca de Nosotros
                </h1>
                <div className='border-t bg-gray-500 my-6' />

                <div className="max-w-6xl">
                    <p className="font-normal text-lg sans-serif mt-8 pl-2 space-y-2 mb-2">
                        En Ticketito, la música y el entretenimiento no solo nos reúnen,
                        sino que nos hacen vibrar, sentir y vivir momentos que se quedan para siempre.
                        Creemos en la magia de los conciertos, en la emoción de corear tu canción favorita y en la adrenalina de estar ahí, en el lugar y momento perfecto. <br />

                    </p>
                    <p className="font-normal text-lg sans-serif mt-6 pl-2 space-y-2 mb-2">
                        Somos un equipo apasionado por la música y la tecnología, comprometidos en brindarte una experiencia sin complicaciones al comprar entradas para
                        los espectáculos que más te emocionan. Nuestra misión es ofrecerte una plataforma rápida, segura y fácil de usar, donde puedas encontrar boletos para los mejores conciertos sin estrés ni filas interminables.
                    </p>

                    <p className="font-normal text-lg sans-serif mt-6 pl-2 space-y-2 mb-2">
                        Nos esforzamos por innovar constantemente, asegurándonos de que cada usuario disfrute de una experiencia fluida, desde la búsqueda de eventos hasta el acceso al recinto. Sabemos que asistir a un concierto no
                        es solo comprar un boleto, sino ser parte de algo más grande: la emoción del momento, la energía del público y la magia de la música en vivo.
                    </p>

                    <p className="font-normal text-lg sans-serif mt-6 pl-2 space-y-2 mb-2">
                        Porque más que vender boletos, conectamos emociones y creamos experiencias inolvidables.
                        Con Ticketito, tu única preocupación será disfrutar el evento. Nosotros nos encargamos del resto.
                    </p>

                    <p className="font-semibold text-lg sans-serif mt-6 pl-2 space-y-2 mb-2">
                        "Ticketito: Tu entrada a la mejor experiencia."
                    </p>

                </div>

            </div>
            <Footer />

        </div>
    );
}
