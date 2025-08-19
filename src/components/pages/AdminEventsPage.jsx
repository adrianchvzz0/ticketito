import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../firebase/authContext";
import { useState, useEffect } from "react";
import Button from "../components/Button";

// Función para verificar si el usuario tiene rol de administrador
const useAdminCheck = (user) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAdmin = async () => {
            console.log('Verificando usuario:', user?.email);
            if (!user) {
                console.log('No hay usuario autenticado');
                setLoading(false);
                return;
            }

            try {
                console.log('Verificando rol de administrador para UID:', user.uid);
                // Usamos el token de autenticación para verificar el rol
                const idTokenResult = await user.getIdTokenResult();
                const isUserAdmin = idTokenResult.claims.admin === true;

                if (isUserAdmin) {
                    console.log('Usuario es administrador (verificado por claim)');
                    setIsAdmin(true);
                } else {
                    // Verificar si está en la lista de respaldo
                    const adminUids = ['8HsDOgISVUc6biI4Jbhz0YvsPjt1'];
                    if (adminUids.includes(user.uid)) {
                        console.log('Usuario en lista blanca de administradores');
                        setIsAdmin(true);
                    } else {
                        console.log('El usuario no tiene permisos de administrador');
                        setIsAdmin(false);
                    }
                }
            } catch (error) {
                console.error('Error al verificar rol de administrador:', error);
            } finally {
                setLoading(false);
            }
        };

        checkAdmin();
    }, [user]);

    return { isAdmin, loading };
};

const categories = [
    "Conciertos",
    "Teatros y Musicales",
    "Familiares",
];

export default function AdminEventsPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);

    const { isAdmin, loading: checkingAdmin } = useAdminCheck(user);

    if (checkingAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-BackgroundBlue text-white font-sans">
                <div className="text-center">
                    <p className="text-xl mb-4">Verificando permisos de administrador...</p>
                    <p className="text-sm text-gray-300">Por favor espera</p>
                </div>
            </div>
        );
    }

    if (!user || !isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-BackgroundBlue text-white font-sans">
                <p>No tienes permisos para acceder a esta página.</p>
            </div>
        );
    }

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            // 1. Subir imágenes al backend
            let imageUrl = "";
            let imageSecondaryUrl = "";

            if (data.primaryImage[0]) {
                const fd1 = new FormData();
                fd1.append("image", data.primaryImage[0]);
                const res1 = await fetch(`${process.env.REACT_APP_API_URL}/upload/upImage`, {
                    method: "POST",
                    body: fd1,
                });
                if (!res1.ok) {
                    const error = await res1.json();
                    throw new Error(error.error || "Error al subir imagen primaria");
                }
                const result1 = await res1.json();
                imageUrl = result1.imageUrl;
            }

            if (data.secondaryImage[0]) {
                const fd2 = new FormData();
                fd2.append("image", data.secondaryImage[0]);
                const res2 = await fetch(`${process.env.REACT_APP_API_URL}/upload/upImage`, {
                    method: "POST",
                    body: fd2,
                });
                if (!res2.ok) {
                    const error = await res2.json();
                    throw new Error(error.error || "Error al subir imagen secundaria");
                }
                const result2 = await res2.json();
                imageSecondaryUrl = result2.imageUrl;
            }

            // 2. Construir payload para crear evento según lo que espera el backend
            const payload = {
                title: data.title,
                location: data.city, // city se mapea a location en el backend
                palco: data.venue,   // venue se mapea a palco en el backend
                date1: data.date1,   // Usando date1 del formulario
                date2: data.date2,   // Usando date2 del formulario
                quantity: parseInt(data.quantity, 10),
                image: imageUrl,
                imageSecondary: imageSecondaryUrl,
                details: data.description, // description se mapea a details
                category: data.category.toUpperCase(),
                prices: {
                    General: parseFloat(data.priceGeneral) || 0,
                    Preferente: parseFloat(data.pricePreferente) || 0,
                    VIP: parseFloat(data.priceVIP) || 0,
                },
            };

            // 3. Enviar solicitud para crear el evento
            const resp = await fetch(`${process.env.REACT_APP_API_URL}/upload/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!resp.ok) {
                const errorData = await resp.json().catch(() => ({}));
                throw new Error(errorData.error || "Error al crear el evento");
            }

            alert("Evento creado exitosamente");
            navigate("/");
        } catch (error) {
            console.error("Error al crear evento:", error);
            alert("Hubo un error al crear el evento");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-BackgroundBlue flex items-center justify-center p-4 text-white font-sans">
            <div className="bg-BackgroundBlueDark border border-PrimaryGreen rounded-3xl p-8 w-full max-w-lg shadow-xl">
                <h1 className="text-2xl font-bold mb-6">Crear nuevo evento</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    <input {...register("title", {
                        required: "Título requerido",
                        minLength: { value: 3, message: "El título debe tener al menos 3 caracteres" },
                        maxLength: { value: 100, message: "Máximo 100 caracteres" },
                        pattern: {
                            value: /^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ .,'-]+$/,
                            message: "Solo letras, números y caracteres válidos"
                        }
                    })} placeholder="Título" className="w-full p-2 bg-transparent border border-PrimaryGreen rounded-xl [&::-webkit-calendar-picker-indicator]:invert" />
                    {errors.title && <p className="text-sm text-red-400">{errors.title.message}</p>}

                    <input 
                        type="date" 
                        className="w-full p-2 bg-transparent border border-PrimaryGreen rounded-xl [&::-webkit-calendar-picker-indicator]:invert" 
                        min={new Date().toISOString().split('T')[0]}
                        {...register("date1", {
                            required: "Fecha de inicio requerida",
                            validate: {
                                futureDate: value => {
                                    const selectedDate = new Date(value);
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    return selectedDate >= today || "La fecha no puede ser anterior al día actual";
                                }
                            }
                        })} 
                        placeholder="Fecha inicio" 
                    />
                    {errors.date1 && <p className="text-sm text-red-400">{errors.date1.message}</p>}

                    <input 
                        type="date" 
                        className="w-full p-2 bg-transparent border border-PrimaryGreen rounded-xl [&::-webkit-calendar-picker-indicator]:invert" 
                        min={new Date().toISOString().split('T')[0]}
                        {...register("date2", {
                            required: "Fecha final requerida",
                            validate: {
                                futureDate: value => {
                                    const selectedDate = new Date(value);
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    return selectedDate >= today || "La fecha no puede ser anterior al día actual";
                                },
                                afterStartDate: (value, { date1 }) => {
                                    if (!date1) return true;
                                    return new Date(value) >= new Date(date1) || "La fecha final debe ser igual o posterior a la fecha de inicio";
                                }
                            }
                    })} placeholder="Fecha final" />
                    {errors.date2 && <p className="text-sm text-red-400">{errors.date2.message}</p>}

                    <input {...register("city", {
                        required: "Ciudad requerida",
                        minLength: { value: 2, message: "La ciudad debe tener al menos 2 caracteres" },
                        maxLength: { value: 50, message: "Máximo 50 caracteres" },
                        pattern: {
                            value: /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ .'-]+$/,
                            message: "Solo letras y caracteres válidos"
                        }
                    })} placeholder="Ciudad" className="w-full p-2 bg-transparent border border-PrimaryGreen rounded-xl" />
                    {errors.city && <p className="text-sm text-red-400">{errors.city.message}</p>}

                    <input {...register("venue", {
                        required: "Lugar requerido",
                        minLength: { value: 2, message: "El lugar debe tener al menos 2 caracteres" },
                        maxLength: { value: 100, message: "Máximo 100 caracteres" }
                    })} placeholder="Lugar" className="w-full p-2 bg-transparent border border-PrimaryGreen rounded-xl" />
                    {errors.venue && <p className="text-sm text-red-400">{errors.venue.message}</p>}

                    <select {...register("category", { required: "Categoria requerida" })} placeholder="Categoria" className="w-full p-2 bg-transparent border border-PrimaryGreen rounded-xl">
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                    {errors.category && <p className="text-sm text-red-400">{errors.category.message}</p>}

                    <textarea {...register("description", {
                        required: "Descripción requerida",
                        minLength: { value: 10, message: "La descripción debe tener al menos 10 caracteres" },
                        maxLength: { value: 500, message: "Máximo 500 caracteres" }
                    })} placeholder="Descripción" className="w-full p-2 bg-transparent border border-PrimaryGreen rounded-xl" />
                    {errors.description && <p className="text-sm text-red-400">{errors.description.message}</p>}

                    <input type="number" step="0.01" {...register("quantity", {
                        required: "Cantidad requerida",
                        min: { value: 1, message: "La cantidad debe ser mayor a 0" },
                        max: { value: 100000, message: "Cantidad demasiado alta" }
                    })} placeholder="Cantidad" className="w-full p-2 bg-transparent border border-PrimaryGreen rounded-xl" />
                    {errors.quantity && <p className="text-sm text-red-400">{errors.quantity.message}</p>}


                    <input type="number" step="0.01" {...register("priceGeneral", {
                        required: "Precio requerido",
                        min: { value: 1, message: "El precio debe ser mayor a 0" },
                        max: { value: 100000, message: "Precio demasiado alto" }
                    })} placeholder="Precio General" className="w-full p-2 bg-transparent border border-PrimaryGreen rounded-xl" />
                    {errors.priceGeneral && <p className="text-sm text-red-400">{errors.priceGeneral.message}</p>}

                    <input type="number" step="0.01" {...register("pricePreferente", {
                        required: "Precio requerido",
                        min: { value: 1, message: "El precio debe ser mayor a 0" },
                        max: { value: 100000, message: "Precio demasiado alto" }
                    })} placeholder="Precio Preferente" className="w-full p-2 bg-transparent border border-PrimaryGreen rounded-xl" />
                    {errors.pricePreferente && <p className="text-sm text-red-400">{errors.pricePreferente.message}</p>}

                    <input type="number" step="0.01" {...register("priceVIP", {
                        required: "Precio requerido",
                        min: { value: 1, message: "El precio debe ser mayor a 0" },
                        max: { value: 100000, message: "Precio demasiado alto" }
                    })} placeholder="Precio VIP" className="w-full p-2 bg-transparent border border-PrimaryGreen rounded-xl" />
                    {errors.priceVIP && <p className="text-sm text-red-400">{errors.priceVIP.message}</p>}

                    <label className="block">Imagen primaria
                        <input type="file" accept="image/*" {...register("primaryImage", {
                            required: "Imagen primaria requerida",
                            validate: fileList => fileList[0]?.size < 2 * 1024 * 1024 || "La imagen debe pesar menos de 2MB"
                        })} className="w-full" />
                    </label>
                    {errors.primaryImage && <p className="text-sm text-red-400">{errors.primaryImage.message}</p>}
                    <label className="block">Imagen secundaria
                        <input type="file" accept="image/*" {...register("secondaryImage", {
                            required: "Imagen secundaria requerida",
                            validate: fileList => fileList[0]?.size < 2 * 1024 * 1024 || "La imagen debe pesar menos de 2MB"
                        })} className="w-full" />
                    </label>
                    {errors.secondaryImage && <p className="text-sm text-red-400">{errors.secondaryImage.message}</p>}

                    <Button type="submit" variant="primary" disabled={loading} className="w-full">
                        {loading ? "Subiendo..." : "Crear Evento"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
