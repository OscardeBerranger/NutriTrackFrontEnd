import React, { createContext, useEffect, ReactNode } from 'react';
import {
    checkCart,
    addToCart,
    getCart
} from "@/utils/cartService";
import productType from "@/interface/productInterface";

interface FoodContextType {
    addProductToCart: (product: productType) => Promise<void>;
}

export const FoodContext = createContext<FoodContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function FoodProvider({ children }: AuthProviderProps) {

    useEffect(() => {

    }, []);


    async function addProductToCart(product: productType) {
        console.log("food adder reached with : ")
        console.log(product);
        await addToCart(product);
    }


    return (
        <FoodContext.Provider value={{ addProductToCart }}>
            {children}
        </FoodContext.Provider>
    );
}
