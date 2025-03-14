import React, { createContext, useEffect, ReactNode } from 'react';
import productType from "@/interface/productInterface";
import {addToCart} from "@/utils/cartService";
import {CartItemType} from '@/interface/cartType'

interface OrderContextType {
    addProductToCart: (id: string, name: string, price: string, quantity: string) => Promise<void>;
}

export const OrderContext = createContext<OrderContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function OrderProvider({ children }: AuthProviderProps) {

    useEffect(() => {

    }, []);


    async function addProductToCart(id: string, name: string, price: string, quantity: string) {
        let product: CartItemType = {
            productId: id,
            productName: name,
            productPrice: +price,
            quantity: +quantity
        }
        await addToCart(product);
    }


    return (
        <OrderContext.Provider value={{ addProductToCart }}>
            {children}
        </OrderContext.Provider>
    );
}
