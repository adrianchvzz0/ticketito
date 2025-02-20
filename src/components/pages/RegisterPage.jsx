import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

export default function RegisterForm({ onSwitch }) {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        console.log("Register Data:", data);
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Crear Cuenta</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <input
                    {...register("name", { required: "El nombre es obligatorio" })}
                    type="text"
                    placeholder="Nombre completo"
                    className="w-full p-2 border rounded-md"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

                <input
                    {...register("email", { required: "El email es obligatorio" })}
                    type="email"
                    placeholder="Correo electrónico"
                    className="w-full p-2 border rounded-md"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

                <input
                    {...register("password", { required: "La contraseña es obligatoria", minLength: { value: 6, message: "Mínimo 6 caracteres" } })}
                    type="password"
                    placeholder="Contraseña"
                    className="w-full p-2 border rounded-md"
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

                <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-md">
                    Registrarse
                </button>
            </form>
            <p className="mt-4 text-center">
                ¿Ya tienes cuenta?{" "}

                <Link to="/login">
                    <button onClick={onSwitch} className="text-blue-500">
                        Inicia sesión
                    </button>
                </Link>
            </p>
        </div>
    );
}
