import {useState, useContext} from "react";
import { StyleSheet, Image, Platform, View, Text, TextInput, Button, Alert } from 'react-native';
import {ThemedText} from "@/components/ThemedText";
import {ThemedView} from "@/components/ThemedView";
import {UserContext} from "@/context/userContext";
import {useNavigation} from "@react-navigation/native"
import {Redirect, useRouter} from "expo-router";

interface user {
    name: string;
    surname: string;
    email: string;
    phoneNumber: string;
    password: string;
}

export default function register() {
    const userContext = useContext(UserContext);
    if (!userContext) {
        return null;
    }
    const navigation = useNavigation();
    let user: user
    const [password, setPassword] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [surName, setSurName] = useState<string>("");

    let {saveUserInfo} = userContext;
    const router = useRouter();

    function handleRedirect() {
        router.push("/registration/login");
    }

    async function handleClick(){
        await saveUserInfo(null);
        user = {
            name: name,
            surname: surName,
            email: email,
            phoneNumber: phoneNumber,
            password: password
        }
        if (user.name !== null && user.surname !== null && user.phoneNumber !== null && user.email !== null) {
            await saveUserInfo(user)
            router.navigate("/registration/register/additionalInformation")
        }
        else{
            console.log(user.name, user.surname, user.phoneNumber, user.email, user.password)
        }
    }

    return (
        <ThemedView style={styles.titleContainer}>
            <ThemedText type="defaultSemiBold">La page de login</ThemedText>

            <Text style={styles.text} >Nom :</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />

            <Text style={styles.text} >Prénom :</Text>
            <TextInput style={styles.input} value={surName} onChangeText={setSurName} />

            <Text style={styles.text} >Email :</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} />

            <Text style={styles.text} >Numéro de téléphone :</Text>
            <TextInput style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} />

            <Text style={styles.text} >Password :</Text>
            <TextInput secureTextEntry={true} style={styles.input} value={password} onChangeText={setPassword} />

            <Text style={styles.text} >Verify Password :</Text>
            <TextInput secureTextEntry={true} style={styles.input}/>

            <Button title="S'enregistrer" onPress={handleClick} />
            <Button title="Déja un compte" onPress={handleRedirect} />
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
