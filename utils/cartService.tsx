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

export async function addToCart(product: productType) {
    console.log("Add to cart service reached with : ")
    console.log(product)
    await checkCart()
    const cart: CartType | null = await getCart()
    if (!cart) {
        return null
    }

    if (cart.products[product.id]) {
        console.log(cart)
        cart.products[product.id].quantity++;
    }else {
        console.log("Cart product don't exist")
        cart.products[product.id] = {
            "productId": product.id.toString(),
            "productName": product.name,
            "productPrice": product.price,
            "quantity": 1
        }
        console.log(cart)
    }
    await setCart(cart);
    return cart;
}
