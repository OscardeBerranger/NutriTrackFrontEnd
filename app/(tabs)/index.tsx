import { ActivityIndicator, Button, Image, FlatList, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "@/context/authContext";
import {useRouter} from "expo-router";
import productType from "@/interface/productInterface";
import {getProducts} from "@/utils/foodService";
import {CartItemType} from "@/interface/cartType";
import {addToCart} from "@/utils/cartService";

export default function PlatesPage() {
  const authContext = useContext(AuthContext);
  const [products, setProducts] = useState<productType[] | null>();
  const [loadingDish, setLoadingDish] = useState<boolean>(true);

  const router = useRouter();
  if (!authContext) {
    return (
        <ThemedView >
          <ThemedText>
            Error unable to load context
          </ThemedText>
        </ThemedView>
    )
  }
  const { logout, userToken, isLoading: authLoading } = authContext;

  async function handleAddToCartClick(product: productType) {
    let cartItem: CartItemType = {
      productId: product.id.toString(),
      productName: product.name,
      productPrice: product.price,
      quantity: 1
    }
    await addToCart(cartItem);
  }

  //Gère la redirection en cas de token missing
  useEffect(() => {
    if (!authLoading) {
      if (!userToken || userToken === "" || userToken === null) {
        router.push("/registration/login");
      }
      if (userToken){
        try {
          getProducts(userToken)
              .then(
                  data=>{
                    setProducts(data);
                    setLoadingDish(false)
                  }
              )
        }catch (err){console.log(err)}
      }
    }
  }, [authLoading, userToken]);

  const renderPlate = ({ item }: { item: productType }) => (
      <ThemedView style={styles.plateCard}>
        <ThemedText type="subtitle">{item.name}</ThemedText>
        <ThemedText>{item.origin}</ThemedText>
        <ThemedText>Restaurant</ThemedText>
        <ThemedText>Restaurant: {item.restaurant.address.street}, {item.restaurant.address.city}</ThemedText>
        <ThemedText>Calories: {item.calories}</ThemedText>
        <ThemedText>Price: ${item.price}</ThemedText>
        <ThemedText>Ingredients: {item.ingredients.map(i => i.name).join(", ")}</ThemedText>
        <Button title={"Add " + item.name + "to cart"} onPress={()=>{
          handleAddToCartClick(item);
        }} />
      </ThemedView>

  );

  return (
      <ThemedView>
        <ThemedText style={styles.text} >text</ThemedText>
        <Button title={"Logout"} onPress={logout} />
        <Button title={"cart"} onPress={()=>{
          router.push("/cart/cart")
        }} />
        <Button title={"Load products"} onPress={()=>{getProducts(userToken)}} />
        {
          loadingDish ? (<ActivityIndicator color={"white"}/> ) :
              (
                  <FlatList
                      data={products}
                      renderItem={renderPlate}
                      keyExtractor={(item) => item.id.toString()}
                      contentContainerStyle={styles.platesList}
                  />
              )
        }
      </ThemedView>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "white"
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  plateCard: {
    padding: 15,
    backgroundColor: "#000",
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  plateImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  platesList: {
    paddingBottom: 50,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
