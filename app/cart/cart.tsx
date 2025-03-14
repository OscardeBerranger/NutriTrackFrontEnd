import { useEffect, useState } from "react";
import {StyleSheet, Text, FlatList, View, Button} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import {addToCart, getCart} from "@/utils/cartService";
import CartType from "@/interface/cartType";
import productType from "@/interface/productInterface";

export default function Cart() {
    const [cart, setCart] = useState<CartType | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCart = async () => {
            const cartData = await getCart();
            setCart(cartData);
            setIsLoading(false);
        };
        fetchCart();
    }, []);


    if (isLoading) {
        return (
            <ThemedView style={styles.container}>
                <Text style={styles.text}>Chargement du panier...</Text>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <Text style={styles.title}>Votre Panier</Text>
            {cart && Object.keys(cart).length > 1 ? (
                <FlatList
                    data={Object.values(cart.products).flat()}
                    keyExtractor={(item) => item.productId}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <Text> {item.productId} </Text>
                            <Text style={styles.text}>{item.productName} - {item.quantity}x</Text>
                            <Text style={styles.text}>{item.productPrice}€</Text>
                            <Button title={"+"} onPress={()=>{
                                // addToCart(item)
                            }} />
                        </View>
                    )}
                />
            ) : (
                <Text style={styles.text}>Votre panier est vide.</Text>
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 20 },
    title: { fontSize: 20, fontWeight: "bold", color: "white", marginBottom: 10 },
    item: { flexDirection: "row", justifyContent: "space-between", padding: 10, borderBottomWidth: 1, borderBottomColor: "#ddd" },
    text: { color: "white" },
});
