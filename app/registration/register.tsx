import {useState, useContext, useEffect} from "react";
import { StyleSheet, Image, Platform, View, Text, TextInput, Button, Alert } from 'react-native';
import {ThemedText} from "@/components/ThemedText";
import {ThemedView} from "@/components/ThemedView";
import {UserContext} from "@/context/userContext";
import {useNavigation} from "@react-navigation/native"
import {useRouter} from "expo-router";
import {userRegistrationType} from "@/interface/userInterface";
import {AuthContext} from "@/context/authContext";


export default function registerPage() {
    const userContext = useContext(UserContext);
    const auth = useContext(AuthContext);
    if (!userContext) {
        return null;
    }
    const navigation = useNavigation();
    let user: userRegistrationType
    const [password, setPassword] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [surName, setSurName] = useState<string>("");

    if (!auth){
        return null
    }

    const { register, login } = auth;

    let {saveUserRegistrationInfo} = userContext;
    const router = useRouter();

    function handleRedirect() {
        router.push("/registration/login");
    }

    async function handleRegistrationClick(){
        await saveUserRegistrationInfo(null);
        user = {
            email: email,
            password: password
        }
        if (user.email !== null && user.password !== null) {
            register(user)
                .then(res=>{
                    if (!user.email || !user.password){
                        return null
                    }
                    login(user.email, user.password)
                    router.push('/profile')
                })

        }
    }

    return (
        <ThemedView style={styles.titleContainer}>
            <ThemedText type="defaultSemiBold">La page de login</ThemedText>

            <Text style={styles.text} >Email :</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} />

            <Text style={styles.text} >Password :</Text>
            <TextInput secureTextEntry={true} style={styles.input} value={password} onChangeText={setPassword} />

            <Text style={styles.text} >Verify Password :</Text>
            <TextInput secureTextEntry={true} style={styles.input}/>

            <Button title="S'enregistrer" onPress={handleRegistrationClick} />
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
    },
    text: {
        color: "white"
    }
});
