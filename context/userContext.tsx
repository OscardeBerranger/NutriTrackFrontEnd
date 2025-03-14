import React, { createContext, useState, useEffect, ReactNode, useContext, useCallback } from 'react';
import {
    getStructuredUser,
    getUser, getUserProfileId,
    saveRegistrationInformation,
    saveStructuredUser,
    userWhipeout
} from '@/utils/userStorage';
import { structuredUserType, userRegistrationType } from '@/interface/userInterface';
import { baseUrl } from "@/constants/globalVariable";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "@/context/authContext";

interface UserContextType {
    userRegistrationInfo: userRegistrationType | null;
    structuredUserInfo: structuredUserType | null;
    isLoading: boolean;
    userProfileId: string | null;
    saveUserRegistrationInfo: (user: userRegistrationType | null) => Promise<void>;
    getUserInfo: () => Promise<userRegistrationType | null>;
    saveStructuredUserInfo: (structuredUser: structuredUserType) => Promise<void>;
    fetchAnyUserData: (token: string | null, path: string) => Promise<number | string | null>;
    fetchUserInfo: (token: string | null) => Promise<void>;
    addCalories: (token: string | null, calories: number) => Promise<void>;
    editUserProfile: (token: string | null, structure: any) => Promise<void>;
    whipeout: () => Promise<void>;
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
    const [userProfileId, setUserProfileId] = useState<string | null>(null);
    const auth = useContext(AuthContext);
    const unredistered: string = "not registered yet"

    if (!auth) return null;

    const { logout } = auth;

    useEffect(() => {
        async function checkUserStatus() {
            setIsLoading(true);
            try {
                const user = await getUser();
                setUserRegistrationInfo(user);
                setStructuredUserInfo(await getStructuredUser());
                const userProfile = await getUserProfileId();
                setUserProfileId(userProfile);
            } catch (error) {
                console.error("Erreur lors du chargement des utilisateurs:", error);
            } finally {
                setIsLoading(false);
            }
        }
        checkUserStatus();
    }, []);

    const saveStructuredUserInfo = async (user: structuredUserType): Promise<void> => {
        saveStructuredUser(user).then(()=>{
            setStructuredUserInfo(user);
        })
    };


    const editUserProfile = useCallback(async (token: string | null, structure: any): Promise<void> => {
        if (!token) return;

        setIsLoading(true);
        try {
            const response = await fetch(
                `${baseUrl}/api/profile/edit`,{
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(structure),
                }
            )
        }catch (error) {console.log(error)}
        finally {
            setIsLoading(false);
        }
    }, [logout])


    const fetchUserInfo = useCallback(async (token: string | null): Promise<void> => {
        if (!token) return;
        setIsLoading(true);
        try {
            const response = await fetch(`${baseUrl}/api/whoami`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 401) {
                logout();
                return;
            }
            const data = await response.json();
            const user: structuredUserType = {
                email: null,
                password: null,
                name: null,
                surname: null,
                phoneNumber: null,
                gender_id: null,
                height: null,
                weight: null,
                birthDate: null,
                sportFrequecy: null
            };

            if (data.email){user.email = data.profile.email}
            if (data.profile.name){user.name = data.profile.name}
            if (data.profile.surname){user.surname = data.profile.surname}
            if (data.profile.phoneNumber){user.phoneNumber = data.profile.phoneNumber}
            if (data.profile.gender){user.gender_id = data.profile.gender.gender}
            if (data.profile.height){user.height = data.profile.height}
            if (data.profile.weight){user.weight = data.profile.weight}
            if (data.profile.birthDate){user.birthDate = data.profile.birthDate}
            if (data.profile.sportFrequecy){user.sportFrequecy = data.profile.sportFrequecy}


            await saveStructuredUser(user);
            setStructuredUserInfo(user);
            console.log(user)
        } catch (error) {
            console.error("Erreur lors de la récupération des informations utilisateur:", error);
        } finally {
            setIsLoading(false);
        }
    }, [logout]);

    const fetchAnyUserData = useCallback(async (token: string | null, path: string): Promise<number | string | null> => {
        if (!token) return null;

        setIsLoading(true);
        try {
            const response = await fetch(`${baseUrl}${path}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 401) {
                logout();
                return null;
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Erreur lors de la récupération des données depuis ${path}:`, error);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [logout]);

    const addCalories = useCallback(async (token: string | null, calories: number) => {
        if (!token) return;

        setIsLoading(true);
        try {
            await fetch(`${baseUrl}/api/calories/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ calories }),
            });
        } catch (error) {
            console.error("Erreur lors de l'ajout des calories:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const saveUserRegistrationInfo = async (user: userRegistrationType | null) => {
        if (user) {
            await saveRegistrationInformation(user);
        }
        setUserRegistrationInfo(user);
    };

    const whipeout = async (): Promise<void> => {
        setIsLoading(true);
        try {
            await userWhipeout();
            setUserRegistrationInfo(null);
            setStructuredUserInfo(null);
        } catch (error) {
            console.error("Erreur lors de la suppression des données utilisateur:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getUserInfo = async (): Promise<userRegistrationType | null> => {
        setIsLoading(true);
        try {
            const user = await getUser();
            setUserRegistrationInfo(user);
            return user;
        } catch (error) {
            console.error("Erreur lors de la récupération des informations utilisateur:", error);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <UserContext.Provider value={{
            userRegistrationInfo,
            structuredUserInfo,
            fetchUserInfo,
            addCalories,
            fetchAnyUserData,
            saveStructuredUserInfo,
            getUserInfo,
            saveUserRegistrationInfo,
            whipeout,
            isLoading,
            userProfileId,
            editUserProfile
        }}>
            {children}
        </UserContext.Provider>
    );
}
