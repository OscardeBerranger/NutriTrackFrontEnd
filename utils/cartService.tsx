import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import CartType, {CartItemType} from "@/interface/cartType";
import productType from "@/interface/productInterface";

const isWeb = Platform.OS === 'web';

const CART_KEY = "cart"

export const checkCart = async () => {
    const emptyCart: CartType = {
        products: {},
        total: 0
    };
    try {
        if (isWeb) {
            const storedCart = localStorage.getItem(CART_KEY);
            if (!storedCart) {
                await setCart(emptyCart);
            }
        } else {
            const storedCart = await SecureStore.getItemAsync(CART_KEY);
            if (!storedCart) {
                await setCart(emptyCart)
            }
        }
    } catch (error) {
        console.error("Erreur lors de l'initialisation du panier :", error);
    }
};

async function setCart(cart: CartType) {
    try {
        if (isWeb) {
            localStorage.setItem(CART_KEY, JSON.stringify(cart));
        } else {
            await SecureStore.setItemAsync(CART_KEY, JSON.stringify(cart));
        }
    } catch (error) {
        console.error("Erreur lors de l'initialisation du panier :", error);
    }
}

export const getCart = async (): Promise<CartType | null> => {
    let cart: CartType | null = null;
    await checkCart();
    try {
        if (isWeb) {
            let cartData = localStorage.getItem(CART_KEY);
            if (!cartData){
                return null;
            }
            cart = JSON.parse(cartData);
            return cart
        } else {
            let cartData = await SecureStore.getItemAsync(CART_KEY);
            if (!cartData){
                return null;
            }
            cart = JSON.parse(cartData);
            return cart
        }
    } catch (error) {
        console.error('Erreur lors de la récupération du token:', error);
        return null;
    }
};

export async function addToCart(product: CartItemType) {
    await checkCart()
    const cart: CartType | null = await getCart()
    if (!cart) {
        return null
    }
    if (cart.products[product.productId]) {
        cart.products[product.productId].quantity++;
    }else{
        cart.products[product.productId] = product
    }

    await setCart(cart);
    return cart;
}

export async function removeFromCart(product: CartItemType) {
    await checkCart()
    const cart: CartType | null = await getCart()
    if (!cart) {
        return null
    }
    if(cart.products[product.productId].quantity - 1 === 0) {
        console.log("Have to be removed")
        delete cart.products[product.productId]
    }
    if (cart.products[product.productId]) {
        cart.products[product.productId].quantity--;
    }

    await setCart(cart);
    return cart;
}

export async function removeCart(){
    if(isWeb){
        localStorage.removeItem(CART_KEY);
    }else {
        await AsyncStorage.removeItem(CART_KEY);
    }
    await checkCart()
}

export async function getCartTotal(): Promise<number | null>{
    await checkCart()
    let returnablePrice = 0
    const cart: CartType | null = await getCart()
    if (!cart) {
        return 0
    }
    Object.entries(cart.products).forEach(([key, value]) => {
        returnablePrice+=value.productPrice * value.quantity
    })
    return returnablePrice
}