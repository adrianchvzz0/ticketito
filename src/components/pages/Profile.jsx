import Header from "../components/HeaderEvents";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { useAuth } from "../../firebase/authContext";
import { db } from "../../firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import Button from "../components/Button";

import { FiLogOut, FiShoppingCart, FiMail, FiUser } from "react-icons/fi";

export default function Profile() {
    const { user, logout } = useAuth();
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchPurchases = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const q = query(
                    collection(db, "purchases"),
                    where("userId", "==", user.uid)
                );
                const querySnapshot = await getDocs(q);
                const purchasesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPurchases(purchasesData);
            } catch (error) {
                console.error("Error obteniendo historial de compras:", error);
            }
            setLoading(false);
        };
        fetchPurchases();
    }, [user]);

    return (
        <div className="bg-BackgroundBlue min-h-screen font-sans flex flex-col">
            <Header />
            <main className="flex-1 flex flex-col items-center w-full px-4 mt-24">
                <section className="w-full max-w-2xl bg-white rounded-2xl shadow-xl mt-8 mb-4 p-8 flex flex-col items-center relative">
                    <div className="bg-BackgroundBlue rounded-full p-4 mb-4 flex items-center justify-center shadow-lg">
                        <FiUser className="text-white text-3xl" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-BackgroundBlue mb-2 tracking-tight">Perfil</h1>
                    <div className="w-full flex flex-col gap-1 mb-4 items-center">
                        <p className="flex items-center text-gray-700 text-base font-medium"><FiUser className="mr-2 text-BackgroundBlue" /> {user?.displayName || "Sin nombre"}</p>
                        <p className="flex items-center text-gray-700 text-base font-medium"><FiMail className="mr-2 text-BackgroundBlue" /> {user?.email}</p>
                    </div>
                    <button onClick={logout} className="mt-2 flex items-center gap-2 bg-BackgroundBlue hover:bg-PrimaryGreen hover:scale-105 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-red-300">
                        <FiLogOut className="inline-block mr-2" /> Cerrar Sesión
                    </button>
                </section>

                <section className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 mb-8">
                    <h2 className="text-2xl font-bold text-BackgroundBlue mb-6 flex items-center gap-2">
                        <FiShoppingCart className="text-BackgroundBlue" /> Historial de compras
                    </h2>
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <span className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-BackgroundBlue mr-3"></span>
                            <p className="text-gray-500">Cargando historial...</p>
                        </div>
                    ) : purchases.length === 0 ? (
                        <div className="flex flex-col items-center py-8">
                            <p className="text-gray-700 text-lg">No tienes compras registradas.</p>
                        </div>
                    ) : (
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {purchases.map((purchase) => (
                                <li key={purchase.id} className="bg-gray-50 rounded-xl shadow-md p-6 flex flex-col gap-1 border border-gray-100 hover:shadow-lg transition-shadow duration-200">
                                    <span className="font-semibold text-lg text-BackgroundBlue mb-1">
                                        {purchase.eventTitle || "Evento no disponible"}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        <strong>Zona:</strong> {purchase.zone || "-"}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        <strong>Cantidad:</strong> {purchase.ticketQuantity || 1}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        <strong>Fecha:</strong> {purchase.purchaseDate || "-"}
                                    </span>
                                    <span className="text-sm text-gray-700 font-bold mt-2">
                                        Total: ${purchase.totalPrice ?? "-"}
                                    </span>
                                </li>

                            ))}
                        </ul>
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
}

