import React, { createContext, useEffect, ReactNode } from 'react';
import productType from "@/interface/productInterface";

interface OrderContextType {
}

export const OrderContext = createContext<OrderContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function FoodProvider({ children }: AuthProviderProps) {

    useEffect(() => {

    }, []);



    return (
        <OrderContext.Provider value={{  }}>
            {children}
        </OrderContext.Provider>
    );
}
