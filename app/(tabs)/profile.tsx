import { useState, useContext, useEffect } from "react";
import { StyleSheet, Text, TextInput, Button, ActivityIndicator, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { ThemedView } from "@/components/ThemedView";
import { AuthContext } from "@/context/authContext";
import { UserContext } from "@/context/userContext";
import { useRouter } from "expo-router";

export default function Profile() {
    const auth = useContext(AuthContext);
    const userContext = useContext(UserContext);
    const router = useRouter();

    if (!auth || !userContext) return null;

    const { editUserProfile, whipeout, fetchUserInfo, userProfileId, structuredUserInfo, isLoading } = userContext;
    const { userToken } = auth;

    // Initialisation de formData avec les types corrects
    const [formData, setFormData] = useState({
        name: "",
        surName: "",
        weight: 0,
        height: 0,
        sportfrequency: "",
        gender_id: 1, // Valeur par défaut : 1 = Homme
        birthDate: "",
    });

    const handleChange = (key: string, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [key]: key === "weight" || key === "height" || key === "gender_id" ? Number(value) : value,
        }));
    };

    // Charger les infos de l'utilisateur
    useEffect(() => {
        if (!structuredUserInfo && userToken) {
            fetchUserInfo(userToken);
        }
    }, [structuredUserInfo, userToken, fetchUserInfo]);

    useEffect(() => {
        if (structuredUserInfo) {
            setFormData({
                name: structuredUserInfo.name || "",
                surName: structuredUserInfo.surname || "",
                weight: structuredUserInfo.weight ?? 0,
                height: structuredUserInfo.height ?? 0,
                sportfrequency: structuredUserInfo.sportFrequecy?.toString() || "",
                gender_id: structuredUserInfo.gender_id?.toString() === "homme" ? 1: 2,  // S'assurer que c'est 1 ou 2
                birthDate: structuredUserInfo.birthDate?.toString() || "",
            });
        }
    }, [structuredUserInfo]);

    if (isLoading) {
        return (
            <ThemedView style={styles.container}>
                <ActivityIndicator size="large" color="#fff" />
            </ThemedView>
        );
    }

    async function handleInformationRegistration() {
        if (!userToken) {
            router.push("/registration/login");
            return;
        }

        const updatedData = {
            ...formData,
            weight: Number(formData.weight),
            height: Number(formData.height),
            gender_id: Number(formData.gender_id), // S'assurer que c'est un nombre
        };

        // Nettoyer les valeurs vides
        const sanitizedData = Object.fromEntries(
            Object.entries(updatedData).filter(([_, value]) => value !== "" && value !== null)
        );

        console.log("Données envoyées :", sanitizedData);

        await editUserProfile(userToken, sanitizedData);
        fetchUserInfo(userToken);
    }

    return (
        <ThemedView style={styles.container}>
            <Text style={styles.text}>{structuredUserInfo?.email || "Erreur lors du chargement de l'utilisateur"}</Text>

            <View key="name">
                <Text style={styles.text}>Nom :</Text>
                <TextInput
                    style={styles.input}
                    value={formData.name}
                    placeholder="Entrer votre nom"
                    onChangeText={(value) => handleChange("name", value)}
                />
            </View>

            <View key="surName">
                <Text style={styles.text}>Prénom :</Text>
                <TextInput
                    style={styles.input}
                    value={formData.surName}
                    placeholder="Entrer votre prénom"
                    onChangeText={(value) => handleChange("surName", value)}
                />
            </View>

            <View key="weight">
                <Text style={styles.text}>Poids (kg) :</Text>
                <TextInput
                    style={styles.input}
                    value={formData.weight.toString()}
                    placeholder="Poids en kg"
                    keyboardType="numeric"
                    onChangeText={(value) => handleChange("weight", value ? Number(value) : 0)}
                />
            </View>

            <View key="height">
                <Text style={styles.text}>Taille (cm) :</Text>
                <TextInput
                    style={styles.input}
                    value={formData.height.toString()}
                    placeholder="Taille en cm"
                    keyboardType="numeric"
                    onChangeText={(value) => handleChange("height", value ? Number(value) : 0)}
                />
            </View>

            <View key="sportfrequency">
                <Text style={styles.text}>Fréquence de sport :</Text>
                <TextInput
                    style={styles.input}
                    value={formData.sportfrequency}
                    placeholder="Jours/semaine"
                    keyboardType="numeric"
                    onChangeText={(value) => handleChange("sportfrequency", value)}
                />
            </View>

            <View key="gender_id">
                <Text style={styles.text}>Genre :</Text>
                <Picker
                    selectedValue={formData.gender_id}
                    style={styles.picker}
                    onValueChange={(value) => handleChange("gender_id", Number(value))}
                >
                    <Picker.Item label="Homme" value={1} />
                    <Picker.Item label="Femme" value={2} />
                </Picker>
            </View>

            <View key="birthDate">
                <Text style={styles.text}>Date de naissance :</Text>
                <TextInput
                    style={styles.input}
                    value={formData.birthDate}
                    placeholder="YYYY-MM-DD"
                    onChangeText={(value) => handleChange("birthDate", value)}
                />
            </View>

            <Button title="Enregistrer les informations" onPress={handleInformationRegistration} />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
    },
    input: {
        borderWidth: 1,
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        backgroundColor: "#ffffff",
    },
    text: {
        color: "white",
    },
    picker: {
        backgroundColor: "#fff",
        borderRadius: 5,
    },
});
