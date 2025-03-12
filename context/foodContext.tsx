import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseUrl} from "@/constants/globalVariable";
import {structuredUserType} from "@/interface/userInterface";

interface FoodContextType {
}

export const FoodContext = createContext<FoodContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function FoodProvider({ children }: AuthProviderProps) {

    useEffect(() => {

    }, []);

    async function loadProducts(token: string) {

    }


    return (
        <FoodContext.Provider value={{  }}>
            {children}
        </FoodContext.Provider>
    );
}
