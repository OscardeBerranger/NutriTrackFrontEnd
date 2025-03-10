import React, { createContext, useState, useEffect, ReactNode } from 'react';
import {getUser, saveUser} from "@/utils/userStorage";
import {baseUrl} from '@/constants/globalVariable'
import {userType} from '@/interface/userInterface'
import {AuthContext} from "@/context/authContext";


interface UserContextType {
    userInfo: userType;
    saveUserInfo: (user: userType | null) => Promise<void>;
    isLoading: boolean;
}

// Création du contexte avec une valeur par défaut
export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
    const [userInfo, setUserInfo] = useState<userType | null>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        async function checkUserStatus() {
            const user = await getUser();
            setUserInfo(user);
            setIsLoading(false);
        }
        checkUserStatus();
    }, []);

    async function saveUserInfo(user: userType){
        await saveUser(user)
    }

    async function getUserInfo(){
        return await getUser();
    }

    // @ts-ignore
    return (
        <UserContext.Provider value={{ userInfo,getUserInfo , saveUserInfo, isLoading }}>
            {children}
        </UserContext.Provider>
    );
}
