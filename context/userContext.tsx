import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getUser, saveUser } from '@/utils/userStorage';
import { userType } from '@/interface/userInterface';

interface UserContextType {
    userInfo: userType | null;
    saveUserInfo: (user: userType | null) => Promise<void>;
    getUserInfo: () => Promise<userType | null>;
    isLoading: boolean;
}

// Création du contexte avec une valeur par défaut
export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
    const [userInfo, setUserInfo] = useState<userType | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        async function checkUserStatus() {
            const user = await getUser();
            setUserInfo(user);
            setIsLoading(false);
        }
        checkUserStatus();
    }, []);

    async function saveUserInfo(user: userType | null) {
        if (user) {
            await saveUser(user);
            setUserInfo(user); // Met à jour le state avec le nouvel utilisateur
        } else {
            setUserInfo(null);
        }
    }

    async function getUserInfo(): Promise<userType | null> {
        const user = await getUser();
        setUserInfo(user);
        return user;
    }

    return (
        <UserContext.Provider value={{ userInfo, getUserInfo, saveUserInfo, isLoading }}>
            {children}
        </UserContext.Provider>
    );
}
