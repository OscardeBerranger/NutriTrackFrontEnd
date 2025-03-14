import React, {createContext, useEffect, ReactNode, useCallback} from 'react';
import {
    checkCart,
    addToCart,
    getCart
} from "@/utils/cartService";
import productType from "@/interface/productInterface";
import {baseUrl} from "@/constants/globalVariable";

interface FoodContextType {
}

export const FoodContext = createContext<FoodContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function FoodProvider({ children }: AuthProviderProps) {

    useEffect(() => {

    }, []);





    return (
        <FoodContext.Provider value={{  }}>
            {children}
        </FoodContext.Provider>
    );
}
