import AsyncStorage from '@react-native-async-storage/async-storage';
import {userRegistrationType} from '@/interface/userInterface'
import {structuredUserType} from "@/interface/userInterface";
import {Platform} from "react-native";

const KEY = 'userData';
const STRUCTURED_KEY = 'structuredUserData';
const PROFILE_ID_KEY = 'profileId';
const isWeb = Platform.OS === 'web';

const emptyUser: userRegistrationType = {
    email: null,
    password: null
}
const emptyStructuredUser: structuredUserType = {
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
}

export async function saveRegistrationInformation(user: userRegistrationType): Promise<void> {
    try {
        await AsyncStorage.setItem(KEY, JSON.stringify(user));
    } catch (error) {
        console.error("Erreur lors de l'enregistrement de l'utilisateur :", error);
    }
}

export async function saveStructuredUser(structuredUser: structuredUserType): Promise<void> {
    try{
        if (isWeb){
            localStorage.setItem(STRUCTURED_KEY, JSON.stringify(structuredUser));
        }else{
            await AsyncStorage.setItem(STRUCTURED_KEY, JSON.stringify(structuredUser));
        }
    }catch(error){
        console.error("Erreur lors de l'enregistrement de l'utilisateur structuré :", error);
    }
}

export async function userWhipeout(): Promise<void> {
    try {
        await AsyncStorage.setItem(KEY, JSON.stringify(emptyUser));
        await AsyncStorage.setItem(STRUCTURED_KEY, JSON.stringify(emptyStructuredUser));
    }catch(error){
        console.log(error)
    }
}

export async function getUser(): Promise<userRegistrationType | null> {
    try {
        let data = await AsyncStorage.getItem(KEY);
        return await JSON.parse(data as string) as userRegistrationType
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

export async function getUserProfileId(){
    try {
        if (isWeb){
            return localStorage.getItem(PROFILE_ID_KEY);
        }else{
            return await AsyncStorage.getItem(PROFILE_ID_KEY);
        }
    }catch(error){
        console.log(error)
        return null;
    }
}