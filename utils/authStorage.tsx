import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const isWeb = Platform.OS === 'web';


export const saveToken = async (token: string, refreshToken: string) => {
    try {
        if (isWeb) {
            localStorage.setItem('userToken', token);
            localStorage.setItem('refreshToken', refreshToken);
        } else {
            await SecureStore.setItemAsync('userToken', token);
            await SecureStore.setItemAsync('refreshToken', refreshToken);
        }
    } catch (error) {
        console.error('Erreur lors de la sauvegarde du token:', error);
    }
};

export const getToken = async (): Promise<string | null> => {
    try {
        if (isWeb) {
            return localStorage.getItem('userToken');
        } else {
            return await SecureStore.getItemAsync('userToken');
        }
    } catch (error) {
        console.error('Erreur lors de la récupération du token:', error);
        return null;
    }
};

export const clearTokens = async () => {
    try {
        if (isWeb) {
            localStorage.removeItem('userToken');
            localStorage.removeItem('refreshToken');
        } else {
            await SecureStore.deleteItemAsync('userToken');
            await SecureStore.deleteItemAsync('refreshToken');
        }
    } catch (error) {
        console.error('Erreur lors de la suppression des tokens:', error);
    }
};
