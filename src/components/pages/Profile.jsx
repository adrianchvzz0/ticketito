import Header from "../components/HeaderEvents";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { useAuth } from "../../firebase/authContext";
import { db } from "../../firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import Button from "../components/Button";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateProfile as firebaseUpdateProfile } from "firebase/auth";
import { Link } from "react-router-dom";


import { FiLogOut, FiShoppingCart, FiMail, FiUser, FiPhone, FiTrash, FiEdit } from "react-icons/fi";

export default function Profile() {
    const { user, logout, deleteAccount } = useAuth();
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userDisplayName, setUserDisplayName] = useState("");
    const [userPhone, setUserPhone] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editName, setEditName] = useState("");
    const [editPhone, setEditPhone] = useState("");
    const [saving, setSaving] = useState(false);

    const handleDeleteAccount = async () => {
        try {
            await deleteAccount(user.uid);
            setShowDeleteModal(false);
        } catch (error) {
            console.error("Error al eliminar la cuenta:", error);
        }
    };

    const openEditModal = () => {
        setEditName(userDisplayName);
        setEditPhone(userPhone !== "Sin teléfono" ? userPhone : "");
        setShowEditModal(true);
    };

    const handleSaveChanges = async () => {
        if (!user) return;
        setSaving(true);
        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, { name: editName.trim(), phone: editPhone.trim() });
            // actualiza displayName en auth si cambió
            if (user.displayName !== editName.trim()) {
                await firebaseUpdateProfile(user, { displayName: editName.trim() });
            }
            setUserDisplayName(editName.trim());
            setUserPhone(editPhone.trim());
            setShowEditModal(false);
        } catch (error) {
            console.error("Error al guardar cambios:", error);
        } finally {
            setSaving(false);
        }
    };

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

    useEffect(() => {
        const fetchUserName = async () => {
            if (user) {
                try {
                    // Si el usuario tiene displayName (Google), usarlo
                    if (user.displayName) {
                        setUserDisplayName(user.displayName);
                    } else {
                        // Si no tiene displayName (registro por email), obtenerlo de Firestore
                        const userDoc = await getDoc(doc(db, "users", user.uid));
                        if (userDoc.exists()) {
                            const userData = userDoc.data();
                            setUserDisplayName(userData.name || "Usuario");
                        } else {
                            setUserDisplayName("Usuario");
                        }
                    }
                } catch (error) {
                    console.error("Error al obtener el nombre del usuario:", error);
                    setUserDisplayName("Usuario");
                }
            } else {
                setUserDisplayName("");
            }
        };

        fetchUserName();
    }, [user]);

    useEffect(() => {
        const fetchUserPhone = async () => {
            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUserPhone(userData.phone || "Sin teléfono");
                    } else {
                        setUserPhone("Sin teléfono");
                    }
                } catch (error) {
                    console.error("Error al obtener el teléfono del usuario:", error);
                    setUserPhone("Sin teléfono");
                }
            } else {
                setUserPhone("");
            }
        };

        fetchUserPhone();
    }, [user]);

    if (!user) {
        return (
            <div className="bg-BackgroundBlue min-h-screen font-sans flex flex-col">
                <Header />
                <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
                    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mt-24">
                        <h2 className="text-2xl font-bold text-BackgroundBlue mb-4">Inicia sesión</h2>
                        <p className="text-gray-700 mb-4">Debes iniciar sesión para ver tu perfil y tus compras.</p>
                        <Link to="/login">
                            <Button variant="primary">Iniciar sesión</Button>
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

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
                        <p className="flex items-center text-gray-700 text-base font-medium"><FiUser className="mr-2 text-BackgroundBlue" /> {userDisplayName || "Sin nombre"}</p>
                        <p className="flex items-center text-gray-700 text-base font-medium"><FiMail className="mr-2 text-BackgroundBlue" /> {user?.email}</p>
                        <p className="flex items-center text-gray-700 text-base font-medium"><FiPhone className="mr-2 text-BackgroundBlue" /> {userPhone || "Sin teléfono"}</p>
                    </div>
                    <button onClick={logout} className="mt-2 flex items-center gap-2 bg-BackgroundBlue hover:bg-PrimaryGreen hover:scale-105 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-red-300">
                        <FiLogOut className="inline-block mr-2" /> Cerrar Sesión
                    </button>
                    <div className="flex gap-3 mt-2">
                        <button onClick={openEditModal} className="flex items-center gap-2 bg-BackgroundBlue hover:bg-PrimaryGreen hover:scale-105 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-green-300"><FiEdit className="inline-block mr-2"/>Editar Datos</button>
                        <button onClick={() => setShowDeleteModal(true)} className="flex items-center gap-2 bg-BackgroundBlue hover:bg-transparent hover:text-BackgroundBlue hover:scale-105 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-red-300"> <FiTrash className="inline-block mr-2" /> Eliminar Cuenta</button>
                    </div>
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

            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-80 text-center shadow-lg">
                        <h3 className="text-xl font-bold text-BackgroundBlue mb-4">Editar datos</h3>
                        <input value={editName} onChange={(e)=>setEditName(e.target.value)} placeholder="Nombre" className="w-full border p-2 rounded-md mb-3" />
                        <input value={editPhone} onChange={(e)=>setEditPhone(e.target.value)} placeholder="Teléfono" className="w-full border p-2 rounded-md mb-6" />
                        <div className="flex justify-center gap-4">
                            <Button variant="default" onClick={()=>setShowEditModal(false)}>Cancelar</Button>
                            <Button variant="primary" disabled={saving} onClick={handleSaveChanges}>{saving?"Guardando...":"Guardar"}</Button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-80 text-center shadow-lg">
                        <h3 className="text-xl font-bold text-BackgroundBlue mb-4">Confirmar eliminación</h3>
                        <p className="text-gray-700 mb-6">¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.</p>
                        <div className="flex justify-center gap-4">
                            <Button variant="default" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
                            <Button variant="danger" onClick={handleDeleteAccount}>Eliminar</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

