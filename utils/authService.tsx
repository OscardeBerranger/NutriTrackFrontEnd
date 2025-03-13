import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import {baseUrl} from "@/constants/globalVariable";
import AsyncStorage from "@react-native-async-storage/async-storage";

const isWeb = Platform.OS === 'web';

const KEY = 'userToken';
const REFRESH_TOKEN_KEY = 'refreshToken';


export const login = async (email: string, password: string) => {
    try {
        let token = "real_token_from_api_" + email;

        fetch(`${baseUrl}/api/login_check`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                {
                    "email": email,
                    "password": password
                }
            ),
        }).then(res => res.json()).then(data => {
            token = data.token;
        }).then(() => {
            AsyncStorage.setItem("userToken", token);
        })
    } catch (error) {
        console.error("Erreur de connexion:", error);
        throw error;
    }
};
