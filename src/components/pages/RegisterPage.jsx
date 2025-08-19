import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import bcrypt from "bcryptjs";

export default function RegisterForm({ onSwitch }) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [passwordStrengthLabel, setPasswordStrengthLabel] = useState("");

    // Corregida la expresión regular - sin doble escape
    const passwordStrengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    const evaluateStrength = (pwd) => {
        if (!pwd) return "";

        // Verificar si cumple con los requisitos básicos
        const hasLowerCase = /[a-z]/.test(pwd);
        const hasUpperCase = /[A-Z]/.test(pwd);
        const hasNumbers = /\d/.test(pwd);
        const hasSymbols = /[^A-Za-z0-9]/.test(pwd);
        const hasMinLength = pwd.length >= 8;

        // Si no cumple con todos los requisitos básicos
        if (!hasLowerCase || !hasUpperCase || !hasNumbers || !hasSymbols || !hasMinLength) {
            return "Débil";
        }

        // Si cumple con todos los requisitos y tiene 12+ caracteres
        if (pwd.length >= 12) {
            return "Fuerte";
        }

        // Si cumple con todos los requisitos pero tiene menos de 12 caracteres
        return "Media";
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            // Crear cuenta en Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
            const user = userCredential.user;
            localStorage.setItem("user", JSON.stringify(user));

            // Encriptar la contraseña antes de guardarla en Firestore
            const hashedPassword = await bcrypt.hash(data.password, 10);

            // Guardar datos del usuario en Firestore
            await setDoc(doc(db, "users", user.uid), {
                name: data.name.trim(),
                email: data.email.toLowerCase(),
                phone: data.phone,
                password: hashedPassword,
                uid: user.uid,
                createdAt: new Date()
            });

            navigate("/");
        } catch (error) {
            let msg;
            switch (error.code) {
                case "auth/email-already-in-use":
                    msg = "El correo ya está en uso.";
                    break;
                case "auth/invalid-email":
                    msg = "Correo electrónico inválido.";
                    break;
                case "auth/weak-password":
                    msg = "Contraseña demasiado débil.";
                    break;
                default:
                    msg = "Ocurrió un error, inténtalo de nuevo.";
            }
            setErrorMessage(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleRegister = async () => {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            // Crea/actualiza documento del usuario en Firestore
            await setDoc(
                doc(db, "users", user.uid),
                {
                    name: user.displayName,
                    email: user.email,
                    uid: user.uid,
                    createdAt: new Date()
                },
                { merge: true }
            );
            localStorage.setItem("user", JSON.stringify(user));
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
                    src="/logoTicketito.webp"
                    alt="logoTicketito"
                    className="w-auto max-w-sm h-28 rounded-2xl shadow-lg"
                />
            </div>

            <div className="w-96 h-auto max-w-sm p-6 bg-BackgroundBlueDark border border-PrimaryGreen rounded-3xl shadow-xl shadow-PrimaryGreen/60 text-center">
                <h2 className="text-2xl font-sans font-bold mb-4 text-white text-left">Crear Cuenta</h2>
                {errorMessage && <p className="text-gray-300 text-sm text-left px-2">{errorMessage}</p>}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-sans">
                    <input
                        maxLength={50}
                        {...register("name", {
                            required: "El nombre es obligatorio",
                            maxLength: { value: 50, message: "Máximo 50 caracteres" },
                            pattern: {
                                value: /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/,
                                message: "Solo se permiten letras y espacios"
                            },
                            validate: value => {
                                const trimmed = value.trim();
                                if (trimmed.length < 2) return "El nombre debe tener al menos 2 caracteres";
                                return true;
                            }
                        })}
                        type="text"
                        placeholder="Nombre completo (solo letras)"
                        className="w-full p-2 bg-transparent border border-PrimaryGreen rounded-xl text-white focus:ring-2 focus:ring-DarkGreen outline-none"
                    />
                    {errors.name && <p className="text-gray-300 text-sm text-left px-2">{errors.name.message}</p>}

                    <input
                        {...register("email", {
                            required: "El email es obligatorio",
                            pattern: { value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i, message: "Email no válido" }
                        })}
                        type="email"
                        placeholder="Correo electrónico"
                        className="w-full p-2 bg-transparent border border-PrimaryGreen rounded-xl text-white focus:ring-2 focus:ring-DarkGreen outline-none"
                    />
                    {errors.email && <p className="text-gray-300 text-sm text-left px-2">{errors.email.message}</p>}

                    <input
                        maxLength={10}
                        {...register("phone", {
                            required: "El teléfono es obligatorio",
                            pattern: { value: /^[0-9]{10}$/, message: "Teléfono inválido" }
                        })}
                        type="tel"
                        placeholder="Teléfono (10 dígitos)"
                        className="w-full p-2 bg-transparent border border-PrimaryGreen rounded-xl text-white focus:ring-2 focus:ring-DarkGreen outline-none"
                    />
                    {errors.phone && <p className="text-gray-300 text-sm text-left px-2">{errors.phone.message}</p>}

                    <input
                        maxLength={30}
                        {...register("password", {
                            required: "La contraseña es obligatoria",
                            validate: value => passwordStrengthRegex.test(value) || "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo"
                        })}
                        onChange={(e) => setPasswordStrengthLabel(e.target.value ? evaluateStrength(e.target.value) : '')}
                        type="password"
                        placeholder="Contraseña"
                        className="w-full p-2 bg-transparent border border-PrimaryGreen rounded-xl text-white focus:ring-2 focus:ring-DarkGreen outline-none"
                    />
                    {errors.password && <p className="text-gray-300 text-sm text-left px-2">{errors.password.message}</p>}
                    {passwordStrengthLabel && (
                        <p className={`text-sm text-left px-2 ${passwordStrengthLabel === 'Fuerte' ? 'text-green-400' : passwordStrengthLabel === 'Media' ? 'text-yellow-400' : 'text-red-400'}`}>
                            Seguridad: {passwordStrengthLabel}
                        </p>
                    )}
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