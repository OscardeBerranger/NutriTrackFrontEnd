import React, {createContext, useState, useEffect, ReactNode, useContext} from 'react';
import {
    getStructuredUser,
    getUser,
    saveRegistrationInformation,
    saveStructuredUser,
    userWhipeout
} from '@/utils/userStorage';
import {structuredUserType, userRegistrationType} from '@/interface/userInterface';
import {baseUrl} from "@/constants/globalVariable";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AuthContext} from "@/context/authContext";

interface UserContextType {
    userRegistrationInfo: userRegistrationType | null;
    saveUserRegistrationInfo: (user: userRegistrationType | null) => Promise<void>;
    getUserInfo: () => Promise<userRegistrationType | null>;
    saveStructuredUserInfo: (structuredUser: structuredUserType | null) => Promise<void>;
    fetchAnyUserData: (token: string,  path: string) => Promise<number | string | null>;
    fetchUserInfo: (token: string) => Promise<void>;
    addCalories: (token: string, calories: number) => Promise<void>;
    isLoading: boolean;
    whipeout: ()=>void;
    structuredUserInfo: structuredUserType | null;
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
    const auth = useContext(AuthContext);

    if (!auth) {
        return null;
    }

    const { logout, login } = auth

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
        await saveStructuredUser(user as structuredUserType);
    }

    async function fetchUserInfo(token: string){
        let data = null
        try {
            fetch(`${baseUrl}/api/whoami`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            })
                .then(res => {
                    if (res.status === 401) {logout()}
                    return res.json()
                })
                .then(data => {
                    let usr: structuredUserType = {
                        email: data.email,
                        password: null,
                        name: data.profile.name,
                        surname: data.profile.surname,
                        phoneNumber: data.profile.phoneNumber,
                        gender_id: data.profile.gender.gender,
                        height: data.profile.height,
                        weight: data.profile.weight,
                        birthDate: data.profile.birthDate,
                        sportFrequecy:data.profile.sportFrequecy
                    }
                    saveStructuredUser(usr);
            })
        } catch (error) {
            console.error("Erreur de connexion:", error);
            throw error;
        }
    }

    async function fetchAnyUserData(token: string, path: string): Promise<number | string | null>{
        let returnable: number | null = null
        await fetch(`${baseUrl}${path}` , {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            })
                .then(res => {
                    if (res.status === 401) {logout()}
                    return res.json()
                })
                .then(data => {
                    returnable = data
                })

        return returnable
    }


    async function addCalories(token: string, calories: number) {
        try {

            fetch(`${baseUrl}/api/calories/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(
                    {
                        "calories": calories
                    }
                ),
            }).then()
        } catch (error) {
            console.error("Erreur de connexion:", error);
            throw error;
        }
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
        <UserContext.Provider value={{ userRegistrationInfo,structuredUserInfo,fetchUserInfo,addCalories ,fetchAnyUserData ,saveStructuredUserInfo ,getUserInfo ,saveUserRegistrationInfo, whipeout, isLoading }}>
            {children}
        </UserContext.Provider>
    );
}
