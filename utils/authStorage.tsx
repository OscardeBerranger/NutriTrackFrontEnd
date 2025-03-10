import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'userToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

// Sauvegarde du token
export async function saveToken(token: string, refreshToken: string): Promise<void> {
    try {
        await AsyncStorage.setItem(TOKEN_KEY, token);
        await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } catch (error) {
        console.error("Erreur lors de l'enregistrement du token :", error);
    }
}

// Récupération du token
export async function getToken(): Promise<string | null> {
    try {
        return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
        console.error("Erreur lors de la récupération du token :", error);
        return null;
    }
}

// Récupération du refresh token
export async function getRefreshToken(): Promise<string | null> {
    try {
        return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
        console.error("Erreur lors de la récupération du refresh token :", error);
        return null;
    }
}

// Suppression des tokens
export async function clearTokens(): Promise<void> {
    try {
        await AsyncStorage.removeItem(TOKEN_KEY);
        await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch (error) {
        console.error("Erreur lors de la suppression des tokens :", error);
    }
}
