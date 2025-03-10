import AsyncStorage from '@react-native-async-storage/async-storage';
import {userType} from '@/interface/userInterface'
const KEY = 'userData';


// Sauvegarde du token
export async function saveUser(user: userType): Promise<void> {
    try {
        await AsyncStorage.setItem(KEY, JSON.stringify(user));
    } catch (error) {
        console.error("Erreur lors de l'enregistrement de l'utilisateur :", error);
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