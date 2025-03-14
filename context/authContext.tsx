import React, {createContext, useState, useEffect, ReactNode, useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseUrl} from "@/constants/globalVariable";
import {structuredUserType, userRegistrationType} from "@/interface/userInterface";
import {UserContext} from "@/context/userContext";
import {Platform} from "react-native";

interface AuthContextType {
    userToken: string | null;
    userProfileId: number | null;
    login: (email: string, password: string) => void;
    logout: () => Promise<void>;
    isLoading: boolean;
    loginRedirect: (email: string, password: string) => void;
    register: (user: userRegistrationType) => Promise<void>;
}
const isWeb = Platform.OS === 'web';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

async function unexportedLogin(email: string, password: string): Promise<string | null>{
    let token: string
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
            return token
        })

    return null
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [userToken, setUserToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [userProfileId, setUserProfileId] = useState<number | null>(null);

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
        let token = await unexportedLogin(email, password)
    }

    async function loginRedirect(email: string, password: string) {
        let token: string
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
    }

    async function register(user: userRegistrationType) {
        try {
            const response = await fetch(`${baseUrl}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    {
                        "email": user.email,
                        "password": user.password
                    }
                ),
            });

            const data = await response.json();


            if (response.ok) {
                if (isWeb){
                    localStorage.setItem("profileId", data.profile.id);
                }else {
                    AsyncStorage.setItem("profileId", data.profile.id);
                }
            }
            else {
                throw new Error(data.message || 'Échec de connexion');
            }
        } catch (error) {
            console.error('Erreur de connexion:', error);
            throw error;
        }
    }

    async function logout() {
        if (isWeb){
            localStorage.removeItem("userToken");
            localStorage.removeItem("structuredUserData")
            localStorage.removeItem("userData")
        }else {
            await AsyncStorage.removeItem("userToken");
            await AsyncStorage.removeItem("structuredUserData")
            await AsyncStorage.removeItem("userData")
        }
        setUserToken(null);
    }

    return (
        <AuthContext.Provider value={{ userToken, login, logout, register ,loginRedirect,  isLoading, userProfileId }}>
            {children}
        </AuthContext.Provider>
    );
}