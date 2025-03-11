import React, { createContext, useState, useEffect, ReactNode } from 'react';
import {getStructuredUser, getUser, saveRegistrationInformation, userWhipeout} from '@/utils/userStorage';
import {structuredUserType, userRegistrationType} from '@/interface/userInterface';

interface UserContextType {
    userRegistrationInfo: userRegistrationType | null;
    saveUserRegistrationInfo: (user: userRegistrationType | null) => Promise<void>;
    getUserInfo: () => Promise<userRegistrationType | null>;
    structuredUserInfo: structuredUserType | null;
    saveStructuredUserInfo: (structuredUser: structuredUserType | null) => Promise<void>;
    isLoading: boolean;
    whipeout: ()=>void;
}

// Création du contexte avec une valeur par défaut
export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
    const [userRegistrationInfo, setUserRegistrationInfo] = useState<userRegistrationType | null>(null);
    const [structuredUserInfo, setStructuredUserInfo] = useState<structuredUserType | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        async function checkUserStatus() {
            const user = await getUser();
            setUserRegistrationInfo(user);
            setStructuredUserInfo(await getStructuredUser())
            setIsLoading(false);
        }
        checkUserStatus();
    }, []);

    async function saveStructuredUserInfo(user: structuredUserType | null): Promise<void> {
        setStructuredUserInfo(user);
    }

    async function saveUserRegistrationInfo(user: userRegistrationType | null) {
        if (user) {
            await saveRegistrationInformation(user);
            setUserRegistrationInfo(user); // Met à jour le state avec le nouvel utilisateur
        } else {
            setUserRegistrationInfo(null);
        }
    }

    async function whipeout():Promise<void>{
        await userWhipeout();
    }

    async function getUserInfo(): Promise<userRegistrationType | null> {
        const user = await getUser();
        setUserRegistrationInfo(user);
        return user;
    }

    return (
        <UserContext.Provider value={{ userRegistrationInfo,structuredUserInfo, saveStructuredUserInfo ,getUserInfo ,saveUserRegistrationInfo, whipeout, isLoading }}>
            {children}
        </UserContext.Provider>
    );
}
