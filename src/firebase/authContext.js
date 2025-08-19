import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { auth, db } from "./firebaseConfig";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut, deleteUser, updateProfile as firebaseUpdateProfile } from "firebase/auth";


const authContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    // Función para cerrar sesión
    const logout = useCallback(async () => {
        try {
            await signOut(auth);
            setUser(null);
            localStorage.removeItem("user"); // Limpieza de localStorage al cerrar sesión
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    }, []);


    // Efecto para manejar el estado de autenticación
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => {
            unsubscribe();
        };
    }, []);



    const updateUserProfile = async (profileData) => {
        try {
            await firebaseUpdateProfile(auth.currentUser, profileData);
            await updateDoc(doc(db, "users", user.uid), profileData);
        } catch (error) {
            console.error("Error al actualizar perfil:", error);
            throw error;
        }
    };

    const deleteAccount = async (uid) => {
        try {
            // Borra documento del usuario en Firestore
            await deleteDoc(doc(db, "users", uid));
            // Elimina la cuenta en Firebase Auth
            await deleteUser(auth.currentUser);
            setUser(null);
        } catch (error) {
            console.error("Error al eliminar cuenta:", error);
            throw error;
        }
    };

    return (
        <authContext.Provider value={{ user, logout, deleteAccount, updateUserProfile }}>
            {children}
        </authContext.Provider>
    );
}


export function useAuth() {
    return useContext(authContext);
}
