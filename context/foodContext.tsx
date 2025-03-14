import React, {createContext, useEffect, ReactNode, useCallback, useState, useContext} from 'react';
import {userRegistrationType} from "@/interface/userInterface";
import productType from "@/interface/productInterface";
import {getProducts} from "@/utils/foodService";


interface FoodContextType {
}

export const FoodContext = createContext<FoodContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function FoodProvider({ children }: AuthProviderProps) {
    const [products, setProducts] = useState<productType[] | null>();





    return (
        <FoodContext.Provider value={{  }}>
            {children}
        </FoodContext.Provider>
    );
}
