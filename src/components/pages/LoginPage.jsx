import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { auth } from "../../firebase/firebaseConfig";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export default function LoginForm({ onSwitch }) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
            const user = userCredential.user;
            localStorage.setItem("user", JSON.stringify(user));
            navigate("/");
        } catch (error) {
            console.error("Login Error:", error.message);
            alert("Error al iniciar sesión. Verifica tus credenciales.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            localStorage.setItem("user", JSON.stringify(result.user));
            navigate("/");
        } catch (error) {
            console.error("Error con Google:", error.message);
            alert("Error al iniciar sesión con Google.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-BackgroundBlue text-white">
            <div className="mb-6 -mt-14">
                <img
                    src="https://storage.googleapis.com/api-ticket-78439.firebasestorage.app/1739980708989-logoTicketito.png"
                    alt="logoTicketito"
                    className="w-auto max-w-xs h-28 rounded-2xl shadow-lg"
                />
            </div>

            <div className="w-96 max-w-sm p-6 bg-BackgroundBlueDark border border-PrimaryGreen rounded-3xl shadow-xl shadow-PrimaryGreen/60 text-center">
                <h2 className="text-2xl sans-serif font-bold mb-4 text-white">Inicia Sesión</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <input
                        {...register("email", { required: "El email es obligatorio" })}
                        type="email"
                        placeholder="Correo"
                        className="w-full p-2 bg-transparent border border-PrimaryGreen rounded-xl text-white focus:ring-2 focus:ring-DarkGreen outline-none"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

                    <input
                        {...register("password", { required: "La contraseña es obligatoria" })}
                        type="password"
                        placeholder="Contraseña"
                        className="w-full p-2 bg-transparent border border-PrimaryGreen rounded-xl text-white focus:ring-2 focus:ring-DarkGreen outline-none"
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

                    <button
                        type="submit"
                        className="w-full btn-default py-2 rounded-md font-semibold shadow-md hover:scale-105 transition flex justify-center items-center"
                        disabled={loading}
                    >
                        {loading ? "Cargando..." : "Iniciar Sesión"}
                    </button>
                </form>

                <div className="flex justify-center mt-4">
                    <button
                        className="p-1 bg-white rounded-full shadow-lg hover:scale-110 transition"
                        onClick={handleGoogleLogin}
                    >
                        <FcGoogle size={28} />
                    </button>
                </div>

                <p className="mt-4 text-white">
                    ¿No tienes cuenta? {" "}
                    <Link to="/register">
                        <button onClick={onSwitch} className="text-PrimaryGreen hover:underline">
                            Regístrate aquí
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
