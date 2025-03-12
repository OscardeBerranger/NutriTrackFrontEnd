import React, {createContext, useState, useEffect, ReactNode, useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseUrl} from "@/constants/globalVariable";
import {structuredUserType} from "@/interface/userInterface";
import {UserContext} from "@/context/userContext";

interface AuthContextType {
    userToken: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
    register: (user: structuredUserType) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [userToken, setUserToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        async function loadTokenFromStorage() {
            try {
                const token = await AsyncStorage.getItem("userToken");
                setUserToken(token);
            } catch (error) {
                console.error("Erreur lors du chargement du token:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadTokenFromStorage()
    }, []);

    async function login(email: string, password: string) {
        try {
            // Remplace ceci par un appel API réel
            let token = "real_token_from_api_" + email;

            fetch(`${baseUrl}/api/login_check`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    {
                        "email": email,
                        "password": password
                    }
                ),
            }).then(res => res.json()).then(data => {
                token = data.token;
            }).then(() => {
                AsyncStorage.setItem("userToken", token);
                setUserToken(token);
            })
        } catch (error) {
            console.error("Erreur de connexion:", error);
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
                        "phoneNumber": user.phoneNumber,
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


    async function logout() {
        await AsyncStorage.removeItem("userToken");
        setUserToken(null);
    }

    return (
        <AuthContext.Provider value={{ userToken, login, logout,register , isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}
