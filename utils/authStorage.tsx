import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const isWeb = Platform.OS === 'web';

const KEY = 'userToken';
const REFRESH_TOKEN_KEY = 'refreshToken';


export const saveToken = async (token: string, refreshToken: string) => {
    try {
        if (isWeb) {
            localStorage.setItem(KEY, token);
            localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        } else {
            await SecureStore.setItemAsync(KEY, token);
            await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
        }
    } catch (error) {
        console.error('Erreur lors de la sauvegarde du token:', error);
    }
};

export const getToken = async (): Promise<string | null> => {
    try {
        if (isWeb) {
            return localStorage.getItem(KEY);
        } else {
            return await SecureStore.getItemAsync(KEY);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération du token:', error);
        return null;
    }
};

export const clearTokens = async () => {
    try {
        if (isWeb) {
            localStorage.removeItem(KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
        } else {
            await SecureStore.deleteItemAsync(KEY);
            await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
        }
    } catch (error) {
        console.error('Erreur lors de la suppression des tokens:', error);
    }
};
