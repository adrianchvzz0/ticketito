import React from "react";

function getButtonClass(variant = "default") {
    const base =
        "px-4 py-2 rounded-md font-semibold shadow-md duration-500 hover:scale-105 transition";

    const variants = {
        default: `${base} bg-gray-200 text-black`,
        primary: `${base} bg-PrimaryGreen text-white`,
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