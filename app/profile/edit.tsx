import {useState, useContext} from "react";
import { StyleSheet, Text, TextInput, Button, Alert } from 'react-native';
import {ThemedView} from "@/components/ThemedView";
import {AuthContext} from "@/context/authContext";
import {UserContext} from "@/context/userContext";
import {useRouter} from "expo-router";

export default function Profile() {
    const auth = useContext(AuthContext);
    const userContext = useContext(UserContext);
    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [sportfrequency, setSportfrequency] = useState("");
    const [gender, setGender] = useState("");
    const [birthDate, setBithDate] = useState("2003/12/17");
    const router = useRouter();
    if (!auth || !userContext) {
        return null
    }

    const { userRegistrationInfo } = userContext;
    const { register , userToken} = auth;
    const { userProfileId } = auth

    async function handleRegistration(){
        if (!userToken || !userProfileId) {
            //router.navigate("/registration/login");
            return;
        }

    }

    console.log("Passed here at last")

    return (
        <ThemedView style={styles.titleContainer}>

            <Text style={styles.text} >Poid :</Text>
            <TextInput style={styles.input} value={weight} onChangeText={setWeight} />

            <Text style={styles.text} >Taille :</Text>
            <TextInput style={styles.input} value={height} onChangeText={setHeight} />

            <Text style={styles.text} >Fréquence de sport :</Text>
            <TextInput style={styles.input} value={sportfrequency} onChangeText={setSportfrequency} />

            <Text style={styles.text} >Genre (1 homme, 2femme)</Text>
            <TextInput style={styles.input} value={gender} onChangeText={setGender} />

            <Text style={styles.text} >Date de naissance</Text>
            <TextInput style={styles.input} value={birthDate} onChangeText={setBithDate} />

            <Button title={"s'enregistrer" } onPress={handleRegistration} />
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
