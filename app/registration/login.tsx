import { useState, useContext, useEffect } from "react";
import { StyleSheet, Text, TextInput, Button, Alert } from 'react-native';
import { ThemedView } from "@/components/ThemedView";
import { AuthContext } from "@/context/authContext";
import { useRouter } from "expo-router";
import {UserContext} from "@/context/userContext";

export default function Login() {
    const auth = useContext(AuthContext);
    const user = useContext(UserContext);
    const router = useRouter();
    const [password, setPassword] = useState<string>("");
    const [email, setEmail] = useState<string>("");

    if (!auth || !user) return null;

    const { userToken, login, isLoading } = auth;
    const { whipeout } = user;
    // Redirige automatiquement si déjà connecté
    useEffect(() => {
        if (!isLoading && userToken) {
            router.replace("/");
        }
    }, [userToken, isLoading]);

    async function handleLogin() {
        try {
            await login(email, password);
            if (userToken) {
                router.replace("/");
            }
        } catch (error: any) {
            Alert.alert('Erreur', error.message);
        }
    }

    function handleClick(){
        router.push('/registration/register/register');
    }

    return (
        <ThemedView style={styles.titleContainer}>
            <Text>La page de login</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} />
            <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
            <Button title="Se connecter" onPress={handleLogin} />
            <Button title="S'enregistrer" onPress={handleClick} />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    titleContainer: { flexDirection: 'row', gap: 8, color: "white" },
    input: { borderWidth: 1, padding: 10, marginVertical: 5, borderRadius: 5, backgroundColor: '#ffffff' }
});
