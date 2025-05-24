import React from "react";

function getButtonClass(variant = "default") {
    const base =
        "px-4 py-2 rounded-lg font-semibold font-sans shadow-md duration-300 hover:scale-105 transition mt-2 ";

    const variants = {
        default: `${base} bg-gray-200 text-black`,
        primary: `${base} bg-gradient-to-r from-PrimaryGreen to-DarkGreen text-white`,
        danger: `${base} bg-red-500 text-white`,
        outline: `${base} border border-white text-white bg-transparent`,
        disabled: `${base} bg-gray-400 text-gray-100 cursor-not-allowed`,
    };

    return variants[variant] || variants.default;
}

export default function Button({
    children,
    variant = "default",
    disabled = false,
    ...props
}) {
    return (
        <button
            className={getButtonClass(disabled ? "disabled" : variant)}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}