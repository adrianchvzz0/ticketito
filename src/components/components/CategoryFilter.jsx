import { useState } from "react";

const categories = ["TODOS", "CONCIERTOS", "TEATROS Y MUSICALES", "FAMILIARES"];

export default function CategoryFilter({ onSelectCategory }) {
    const [selected, setSelected] = useState("TODOS");

    const handleCategoryClick = (category) => {
        setSelected(category);
        onSelectCategory(category); // Llamar a la función con la categoría seleccionada
    };

    return (
        <div className="flex space-x-4 text-white font-semibold">
            {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className={`px-6 py-1 rounded-lg duration-300 transition-all ${selected === category
                        ? "bg-button-default text-white shadow-lg"
                        : "text-gray-300 hover:text-white"
                        }`}
                >
                    {category}
                </button>
            ))}
        </div>
    );
}
