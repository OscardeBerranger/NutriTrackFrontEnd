import {useState, useContext} from "react";
import { StyleSheet, Image, Platform, View, Text, TextInput, Button, Alert } from 'react-native';
import {ThemedText} from "@/components/ThemedText";
import {ThemedView} from "@/components/ThemedView";
import {AuthContext} from "@/context/authContext";
import {useNavigation} from "@react-navigation/native"
import {Redirect, useRouter} from "expo-router";


export default function login() {
    const auth = useContext(AuthContext);
    if (!auth) {
        return null
    }
    const navigation = useNavigation();
    const [password, setPassword] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const { login } = auth;
    const router = useRouter();

    async function handleLogin() {
        try {
            await login(email, password);
            router.navigate("/")

        } catch (error: any) {
            Alert.alert('Erreur', error.message);
        }
    }

    function handleClick(){
        router.push({pathname: "/registration/register/register", params: {email} })
    }

    return (
        <ThemedView style={styles.titleContainer}>
            <ThemedText type="defaultSemiBold">La page de login</ThemedText>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} />
            <TextInput style={styles.input} value={password} onChangeText={setPassword} />
            <Button title="Se connecter" onPress={handleLogin} />

            <Button title="Redirect me" onPress={handleClick} />
        </ThemedView>

);
}

const styles = StyleSheet.create({
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
        color: "white",
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#ffffff',
    },
    input: {
        borderWidth: 1,
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        backgroundColor: '#ffffff'
    }
});
