import { ActivityIndicator, Button, Image, FlatList, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/authContext";
import { HelloWave } from "@/components/HelloWave";
import { useRouter } from "expo-router";
import { UserContext } from "@/context/userContext";
import ParallaxScrollView from "@/components/ParallaxScrollView";

// Import de l'interface `productType`
import productType from "@/interface/productInterface";
import {baseUrl} from "@/constants/globalVariable";
import {FoodContext} from "@/context/foodContext";

export default function PlatesPage() {
  const auth = useContext(AuthContext);
  const userInfo = useContext(UserContext);
  const foodContext = useContext(FoodContext);
  const router = useRouter();

  const [plates, setPlates] = useState<productType[]>([]); // Utilisation de `productType` directement
  const [isLoading, setIsLoading] = useState<boolean>(true);

  if (!auth || !userInfo || !foodContext) {
    return (
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Erreur : Contexte non défini !</ThemedText>
          <HelloWave />
        </ThemedView>
    );
  }

  const { logout, userToken, isLoading: authLoading } = auth;
  const { addProductToCart } = foodContext;
  const { structuredUserInfo } = userInfo;
  async function handleAddToCartClick(product: productType) {
    console.log("handler reached")
    await addProductToCart(product);
  }
  console.log(structuredUserInfo)

  // Fonction pour récupérer les plats depuis l'API
  const fetchPlates = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/api/product/all`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      // Formatage des données selon l'interface `productType`
      const formattedPlates: productType[] = data.map((plate: any) => ({
        id: plate.id,
        name: plate.name,
        calories: plate.calories,
        price: plate.price,
        origin: plate.origin,
        ingredients: plate.ingredients.map((ingredient: any) => ({
          id: ingredient.id,
          name: ingredient.name
        })),
        restaurant: {
          id: plate.restaurant.id,
          address: {
            streetNumber: plate.restaurant.Address.streetNumber,
            street: plate.restaurant.Address.street,
            zipcode: plate.restaurant.Address.zipcode,
            city: plate.restaurant.Address.city,
            country: plate.restaurant.Address.country
          }
        }
      }));
      console.log(formattedPlates);
      setPlates(formattedPlates);
      setIsLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des plats:", error);
      setIsLoading(false);
    }
  }, [userToken]);

  useEffect(() => {
    if (!authLoading) {
      fetchPlates();
    }
  }, [authLoading, fetchPlates]);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  // Affichage d'un plat dans une carte
  const renderPlate = ({ item }: { item: productType }) => (
      <ThemedView style={styles.plateCard}>
        <Button title={"logout"} onPress={logout} />
        <ThemedText type="subtitle">{item.name}</ThemedText>
        <ThemedText>{item.origin}</ThemedText>
        <ThemedText>Restaurant: {item.restaurant.address.street}, {item.restaurant.address.city}</ThemedText>
        <ThemedText>Calories: {item.calories}</ThemedText>
        <ThemedText>Price: ${item.price}</ThemedText>
        <ThemedText>Ingredients: {item.ingredients.map(i => i.name).join(", ")}</ThemedText>
        <Button title="Ajouter aux repas" onPress={() => handleAddToCartClick(item)} />
      </ThemedView>
  );

  return (
      <ParallaxScrollView
          headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
          headerImage={
            <Image source={require("@/assets/images/partial-react-logo.png")} style={styles.reactLogo} />
          }
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Plats Disponibles</ThemedText>
          <HelloWave />
        </ThemedView>

        <FlatList
            data={plates}
            renderItem={renderPlate}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.platesList}
        />
      </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
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
