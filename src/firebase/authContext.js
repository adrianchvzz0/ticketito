import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebaseConfig"; // Tu configuración de Firebase
import { onAuthStateChanged, signOut } from "firebase/auth";

const authContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        await signOut(auth);
        setUser(null);
    };

    return (
        <authContext.Provider value={{ user, logout }}>
            {children}
        </authContext.Provider>
    );
}

export function useAuth() {
    return useContext(authContext);
}
