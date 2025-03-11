import AsyncStorage from '@react-native-async-storage/async-storage';
import {userType} from '@/interface/userInterface'
import {structuredUserType} from "@/interface/userInterface";

const KEY = 'userData';
const STRUCTURED_KEY = 'structuredUserData';


// Sauvegarde du token
export async function saveUser(user: userType): Promise<void> {
    try {
        await AsyncStorage.setItem(KEY, JSON.stringify(user));
    } catch (error) {
        console.error("Erreur lors de l'enregistrement de l'utilisateur :", error);
    }
}

export async function saveStructuredUser(structuredUser: structuredUserType): Promise<void> {
    try{
        await AsyncStorage.setItem(STRUCTURED_KEY, JSON.stringify(structuredUser));
    }catch(error){
        console.error("Erreur lors de l'enregistrement de l'utilisateur structuré :", error);
    }
}

export async function getUser(): Promise<userType | null> {
    try {
        let data = await AsyncStorage.getItem(KEY);
        return await JSON.parse(data as string) as userType
    } catch (error) {
        console.error("Erreur lors de la récupération du token :", error);
        return null;
    }
}

export async function getStructuredUser(): Promise<structuredUserType | null> {
    try {
        let data = await AsyncStorage.getItem(STRUCTURED_KEY);
        return await JSON.parse(data as string) as structuredUserType
    } catch (error) {
        console.error("Erreur lors de la récupération du token :", error);
        return null;
    }
}