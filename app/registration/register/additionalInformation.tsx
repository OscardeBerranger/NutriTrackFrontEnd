import {useState, useContext} from "react";
import { StyleSheet, Image, Platform, View, Text, TextInput, Button, Alert } from 'react-native';
import {ThemedText} from "@/components/ThemedText";
import {ThemedView} from "@/components/ThemedView";
import {AuthContext} from "@/context/authContext";
import {useNavigation} from "@react-navigation/native"
import {Redirect, useRouter} from "expo-router";
import {UserContext} from "@/context/userContext";
import { userType, structuredUserType } from "@/interface/userInterface";

export default function additionalInformation() {
    const auth = useContext(AuthContext);
    const userContext = useContext(UserContext);
    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [sportfrequency, setSportfrequency] = useState("");
    const [gender, setGender] = useState("");
    const [birthDate, setBithDate] = useState("2003/12/17");

    if (!auth || !userContext) {
        return null
    }

    const navigation = useNavigation();
    const { userInfo } = userContext;
    const { register } = auth;
    const { login } = auth
    const router = useRouter();

    console.log(userInfo)
    async function handleRegistration(){
        let structuredUser: structuredUserType = {
            "email": userInfo.email,
            "password": userInfo.password,
            "name": userInfo.name,
            "surname": userInfo.surname,
            "gender_id": parseInt(gender),
            "height": parseInt(height),
            "weight": parseInt(weight),
            "birthDate": birthDate,
            "sportFrequecy": parseInt(sportfrequency)
        }
        console.log(structuredUser);
        try{
            await register(structuredUser)
                .then(async (res) => {
                    await login(structuredUser.email, userInfo.password);
                    router.navigate("/")
                })


        }catch(error){
            console.log(error)
        }
    }

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
