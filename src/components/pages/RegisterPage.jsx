import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export default function RegisterForm({ onSwitch }) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                name: data.name,
                email: data.email,
                uid: user.uid,
                createdAt: new Date()
            });

            console.log("Usuario registrado y guardado en Firestore:", user);
            navigate("/");
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleRegister = async () => {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const token = await result.user.getIdToken();
            localStorage.setItem("user", JSON.stringify(result.user));
            navigate("/");
        } catch (error) {
            console.error("Error con Google:", error.message);
            alert("Error al registrarse con Google.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-BackgroundBlue text-white">
            <div className="mb-6 -mt-14 ">
                <img
                    src="https://storage.googleapis.com/api-ticket-78439.firebasestorage.app/1739980708989-logoTicketito.png"
                    alt="logoTicketito"
                    className="w-auto max-w-sm h-28 rounded-2xl shadow-lg"
                />
            </div>

            <div className="w-96 h-auto max-w-sm p-6 bg-BackgroundBlueDark border border-PrimaryGreen rounded-3xl shadow-xl shadow-PrimaryGreen/60 text-center">
                <h2 className="text-2xl font-sans font-bold mb-4 text-white text-left">Crear Cuenta</h2>
                {errorMessage && <p className="text-gray-300 text-sm text-left px-2">{errorMessage}</p>}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-sans">
                    <input
                        {...register("name", { required: "El nombre es obligatorio" })}
                        type="text"
                        placeholder="Nombre completo"
                        className="w-full p-2 bg-transparent border border-PrimaryGreen rounded-xl text-white focus:ring-2 focus:ring-DarkGreen outline-none"
                    />
                    {errors.name && <p className="text-gray-300 text-sm text-left px-2">{errors.name.message}</p>}

                    <input
                        {...register("email", { required: "El email es obligatorio" })}
                        type="email"
                        placeholder="Correo electrónico"
                        className="w-full p-2 bg-transparent border border-PrimaryGreen rounded-xl text-white focus:ring-2 focus:ring-DarkGreen outline-none"
                    />
                    {errors.email && <p className="text-gray-300 text-sm text-left px-2">{errors.email.message}</p>}

                    <input
                        {...register("password", { required: "La contraseña es obligatoria", minLength: { value: 6, message: "Mínimo 6 caracteres" } })}
                        type="password"
                        placeholder="Contraseña"
                        className="w-full p-2 bg-transparent border border-PrimaryGreen rounded-xl text-white focus:ring-2 focus:ring-DarkGreen outline-none"
                    />
                    {errors.password && <p className="text-gray-300 text-sm text-left px-2">{errors.password.message}</p>}
                    <button
                        type="submit"
                        className="w-full btn-default py-2 rounded-md font-semibold shadow-md hover:scale-105 transition flex justify-center items-center"
                        disabled={loading}
                    >
                        {loading ? "Cargando..." : "Registrarse"}
                    </button>
                </form>

                <div className="flex justify-center mt-4">
                    <button
                        className="p-1 bg-white rounded-full shadow-lg hover:scale-110 transition"
                        onClick={handleGoogleRegister}
                    >
                        <FcGoogle size={28} />
                    </button>
                </div>

                <p className="mt-4 text-white">
                    ¿Ya tienes cuenta? {" "}
                    <Link to="/login">
                        <button onClick={onSwitch} className="text-PrimaryGreen hover:underline">
                            Inicia sesión
                        </button>
                    </Link>
                </p>

                <div className="flex justify-center mt-4">
                    <Link to="/">
                        <button className="btn-default font-semibold shadow-md transition">
                            Volver
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
