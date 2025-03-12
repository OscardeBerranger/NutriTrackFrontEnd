import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import CartType from "@/interface/cartType";

const isWeb = Platform.OS === 'web';

const CART_KEY = "cart"

const checkCart = async () => {
    const emptyCart: CartType = {
        "products": [],
        "total": 0
    }
    if (isWeb)
    {
        if (!localStorage.getItem(CART_KEY))
        {
            localStorage.setItem(CART_KEY, JSON.stringify(emptyCart));
        }
    }
    else
    {
        let cart = SecureStore.getItem(CART_KEY);
        if (!cart)
        {
            SecureStore.setItem(CART_KEY, JSON.stringify(emptyCart));
        }
    }
}

export const addCartItem = async (token: string, refreshToken: string) => {
    try {
        if (isWeb) {

            localStorage.setItem(CART_KEY, token);
        } else {
            await SecureStore.setItemAsync('userToken', token);
        }
    } catch (error) {
        console.error('Erreur lors de la sauvegarde du token:', error);
    }
};

