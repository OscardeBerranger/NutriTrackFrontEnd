import { ActivityIndicator, Button, Image, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useCallback, useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "@/context/authContext";
import { HelloWave } from "@/components/HelloWave";
import { useRouter } from "expo-router";
import { UserContext } from "@/context/userContext";
import ParallaxScrollView from "@/components/ParallaxScrollView";

export default function Profile() {
    const auth = useContext(AuthContext);
    const userInfo = useContext(UserContext);
    const router = useRouter();

    const [requiredCalories, setRequiredCalories] = useState<number | null>(null);
    const [consumedCalories, setConsumedCalories] = useState<number | null>(null);
    const isFirstRender = useRef(true); // Empêche useEffect de boucler au montage

    if (!auth || !userInfo) {
        console.log(userInfo);
        return (
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Erreur : Contexte non défini !</ThemedText>
                <HelloWave />
            </ThemedView>
        );
    }

    const { userToken,logout , isLoading } = auth;
    const { fetchAnyUserData, structuredUserInfo, whipeout, fetchUserInfo, addCalories } = userInfo;
    console.log(structuredUserInfo);

    if (!structuredUserInfo?.weight || !structuredUserInfo?.height || !structuredUserInfo.gender_id) {
        console.log("missing datas")
    }

    const retrieveUserCalories = useCallback(async () => {
        if (requiredCalories !== null) return; // Empêche de refaire l'appel si déjà chargé
        try {
            const data = await fetchAnyUserData(userToken, "/api/calories/required") as number;
            setRequiredCalories(data);
        } catch (error) {
            console.error("Erreur lors de la récupération des calories requises:", error);
        }
    }, [fetchAnyUserData, userToken, requiredCalories]);

    const retrieveUserConsumedCalories = useCallback(async () => {
        if (consumedCalories !== null) return;
        try {
            const data = await fetchAnyUserData(userToken, "/api/calories/getConsumed") as number;
            setConsumedCalories(data);
        } catch (error) {
            console.error("Erreur lors de la récupération des calories consommées:", error);
        }
    }, [fetchAnyUserData, userToken, consumedCalories]);

    const addCaloriesToUser = useCallback(async () => {
        try {
            await addCalories(userToken, 100);
            setConsumedCalories(prev => (prev !== null ? prev + 100 : 100));
        } catch (error) {
            console.error("Erreur lors de l'ajout de calories:", error);
        }
    }, [addCalories, userToken]);

    useEffect(() => {
        if (!isLoading && !userToken) {
            router.push("/registration/login");
        }

        if (!isLoading) {
            if (!structuredUserInfo?.name) {
                fetchUserInfo(userToken);
            }
            if (structuredUserInfo?.password) {
                whipeout();
                fetchUserInfo(userToken);
            }

            if (isFirstRender.current) {
                retrieveUserCalories();
                retrieveUserConsumedCalories();
                isFirstRender.current = false; // Empêche de réexécuter au prochain render
            }
        }
    }, [userToken, isLoading, structuredUserInfo, fetchUserInfo, whipeout, retrieveUserCalories, retrieveUserConsumedCalories]);

    if (isLoading || requiredCalories === null || consumedCalories === null) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
            headerImage={
                <Image source={require("@/assets/images/partial-react-logo.png")} style={styles.reactLogo} />
            }
        >
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Salut {structuredUserInfo?.name || "Utilisateur"}</ThemedText>
                <HelloWave />
            </ThemedView>

            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">
                    Aujourd'hui, tu as besoin de consommer un total de {requiredCalories} calories.
                </ThemedText>
            </ThemedView>

            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">
                    Il te reste actuellement {requiredCalories - consumedCalories} calories à consommer.
                </ThemedText>
            </ThemedView>

            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">
                    Tu as déjà consommé {consumedCalories}  calories.
                </ThemedText>
            </ThemedView>
            <Button title={"Logout"} onPress={logout} />
            <Button title="Ajouter 100 calories" onPress={addCaloriesToUser} />
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: "absolute",
    },
});
