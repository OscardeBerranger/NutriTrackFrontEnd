import { useState, useContext, useEffect } from "react";
import { StyleSheet, Text, TextInput, Button, ActivityIndicator } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { AuthContext } from "@/context/authContext";
import { UserContext } from "@/context/userContext";
import { useRouter } from "expo-router";

export default function Profile() {
    const auth = useContext(AuthContext);
    const userContext = useContext(UserContext);
    const router = useRouter();

    if (!auth || !userContext) return null;

    const { editUserProfile, whipeout, fetchUserInfo,userProfileId , structuredUserInfo, isLoading } = userContext;
    const { userToken } = auth;

    const [formData, setFormData] = useState({
        name: "",
        surName: "",
        weight: "",
        height: "",
        sportfrequency: "",
        gender: "",
        birthDate: "",
    });

    const handleChange = (key: string, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    useEffect(() => {
        if (!structuredUserInfo && userToken) {
            fetchUserInfo(userToken);

        }
        else console.log(structuredUserInfo);
    }, [structuredUserInfo, userToken]);

    useEffect(() => {
        if (structuredUserInfo) {
            setFormData({
                name: structuredUserInfo.name || "",
                surName: structuredUserInfo.surname || "",
                weight: structuredUserInfo.weight?.toString() || "",
                height: structuredUserInfo.height?.toString() || "",
                sportfrequency: structuredUserInfo.sportFrequecy?.toString() || "",
                gender: structuredUserInfo.gender_id?.toString() || "",
                birthDate: structuredUserInfo.birthDate?.toString() || "",
            });
        }
    }, [structuredUserInfo]);

    async function handleInformationRegistration() {
        if (!userToken) {
            router.navigate("/registration/login");
            return;
        }

        const updatedData = Object.entries(formData).reduce((acc, [key, value]) => {
            if (value) acc[key] = value;
            return acc;
        }, {} as Record<string, string | number>);

        await editUserProfile(userToken,userProfileId , updatedData)
        await whipeout()
    }

    if (isLoading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <ThemedView style={styles.container}>
            <Text style={styles.text}>{structuredUserInfo?.email || "Error loading user"}</Text>

            {Object.keys(formData).map((key) => (
                <ThemedView key={key}>
                    <Text style={styles.text}>{key} :</Text>
                    <TextInput
                        style={styles.input}
                        value={formData[key as keyof typeof formData]}
                        placeholder="Entrer une valeur"
                        onChangeText={(value) => handleChange(key, value)}
                    />
                </ThemedView>
            ))}

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
});
