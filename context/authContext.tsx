import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getToken, saveToken, clearTokens } from '@/utils/authStorage';
import {baseUrl} from '@/constants/globalVariable'
import {structuredUserType, userType} from "@/interface/userInterface";
// Définition du type pour le contexte
interface AuthContextType {
    userToken: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (user: structuredUserType) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
}

// Création du contexte avec une valeur par défaut
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Définition des props du AuthProvider
interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [userToken, setUserToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        async function checkLoginStatus() {
            const token = await getToken();
            setUserToken(token);
            setIsLoading(false);
        }
        checkLoginStatus();
    }, []);

    // Fonction de connexion
    async function login(email: string, password: string) {
        try {
            const response = await fetch(`${baseUrl}/api/login_check`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    {
                        "email": email,
                        "password": password
                    }
                ),
            });

            const data = await response.json();

            if (response.ok) {
                await saveToken(data.token, data.refreshToken);
                setUserToken(data.token);
            } else {
                throw new Error(data.message || 'Échec de connexion');
            }
        } catch (error) {
            console.error('Erreur de connexion:', error);
            throw error;
        }
    }

    async function register(user: structuredUserType) {
        try {
            const response = await fetch(`${baseUrl}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    {
                        "email": user.email,
                        "password": user.password,
                        "name": user.name,
                        "surname": user.surname,
                        "gender_id": user.gender_id,
                        "height": user.height,
                        "weight": user.weight,
                        "birthDate": user.birthDate,
                        "sportFrequecy": user.sportFrequecy,
                    }
                ),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("registration was successfull")
            } else {
                throw new Error(data.message || 'Échec de connexion');
            }
        } catch (error) {
            console.error('Erreur de connexion:', error);
            throw error;
        }
    }

    // Fonction de déconnexion
    async function logout() {
        await clearTokens();
        setUserToken(null);
    }

    return (
        <AuthContext.Provider value={{ userToken, register, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}
