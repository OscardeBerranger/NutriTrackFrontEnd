import { CartItemType } from "@/interface/cartType";
import {baseUrl} from "@/constants/globalVariable";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {removeCart} from "@/utils/cartService";

interface OrderBody {
    items: { id: string; quantity: number }[];
    address: string;
}

export async function placeOrder(products: Record<string, CartItemType>, userToken: string | null): Promise<void | null> {
    if (!userToken) {
        return null
    }
    let body: OrderBody = {
        items: Object.values(products).map(product => ({
            id: product.productId,
            quantity: product.quantity
        })),
        address: "", // Ajoute ici l'adresse correcte
    };

    fetch(`${baseUrl}/api/order/place`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify(body)
    })
        .then(res=>res.json())
        .then(json => {console.log(json)})

    removeCart()
}
