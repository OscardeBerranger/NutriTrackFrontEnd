import {useContext, useEffect, useState} from "react";
import { StyleSheet, Text, FlatList, View, Button } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import {addToCart, getCart, getCartTotal, removeFromCart} from "@/utils/cartService";
import CartType from "@/interface/cartType";
import {placeOrder} from "@/utils/OrderService";
import {AuthContext} from "@/context/authContext";
import {ThemedText} from "@/components/ThemedText";
import {HelloWave} from "@/components/HelloWave";

export default function Cart() {
    const auth = useContext(AuthContext);
    const [cart, setCart] = useState<CartType | null>(null);
    const [cartTotal, setCartTotal] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    if (!auth){
        return (
        <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">Erreur : Contexte non défini !</ThemedText>
            <HelloWave />
        </ThemedView>
        )
    }

    const { userToken } = auth;


    // Fonction pour récupérer le panier et le mettre à jour
    const fetchCart = async () => {
        const cartData = await getCart();
        const cartPrice = await getCartTotal();
        setCart(cartData);
        setCartTotal(cartPrice);
        setIsLoading(false);
        getCartTotal()
    };

    useEffect(() => {
        fetchCart();
    }, []);

    // Ajoute au panier et met à jour le state
    const handleAddToCart = async (product: any) => {
        await addToCart(product);
        await fetchCart(); // Recharge le panier après l'ajout
    };

    const handleRemoveFromCart = async (product: any) => {
        await removeFromCart(product);
        await fetchCart(); // Recharge le panier après l'ajout
    };



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
            {cart && cart.products && Object.keys(cart.products).length > 0 ? (
                    <ThemedView style={styles.container}>
                        <Text style={styles.text}>Prix : {cartTotal} €</Text>
                        <FlatList
                            data={Object.values(cart.products).flat()}
                            keyExtractor={(item) => item.productId.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.item}>
                                    <Text style={styles.text}>{item.productName} - {item.quantity}x</Text>
                                    <Text style={styles.text}>{item.productPrice}€</Text>
                                    <Button title={"+"} onPress={() => handleAddToCart(item)} />
                                    <Button title={"-"} onPress={() => handleRemoveFromCart(item)} />
                                </View>
                            )}
                        />
                        <Button title={"Valider la commande"} onPress={()=>{
                            placeOrder(cart.products, userToken)
                                .then(result => {fetchCart()})
                        }} />
                    </ThemedView>

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
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 20,
    },
});
