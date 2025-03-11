import {ActivityIndicator, Button, Image, Platform, StyleSheet} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "@/context/authContext";
import {HelloWave} from "@/components/HelloWave";
import {useRouter} from "expo-router";
import {UserContext} from "@/context/userContext";
import ParallaxScrollView from "@/components/ParallaxScrollView";



export default function profile() {
    const auth = useContext(AuthContext);
    const info = useContext(UserContext);
    const router = useRouter()
    const [requiredCalories, setRequiredCalories] = useState<number>(0);
    const [consumedCalories, setConsumedCalories] = useState<number>(0);
    if (!auth) {
        return (
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Erreure AuthContext non défini !</ThemedText>
                <HelloWave />
            </ThemedView>
        )
    }

    const { userToken, isLoading } = auth;
    const { fetchAnyUserData, structuredUserInfo , whipeout , fetchUserInfo } = info;

    useEffect(() => {

        if (!isLoading && !userToken) {
            router.push("/registration/login")
        }


        if (!isLoading){
            if (!structuredUserInfo.name){
                fetchUserInfo(userToken);
            }
            if(structuredUserInfo.password){
                whipeout().then(()=>{
                    fetchUserInfo(userToken);
                })
            }
            try{
                retrieveUserCalories()
                retrieveUserConsumedCalories()
                console.log(requiredCalories as number - consumedCalories as number)
            }catch (err){
                throw err
            }
            console.log(structuredUserInfo);
        }
    }, [userToken, isLoading])

    if (isLoading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    async function retrieveUserCalories(){
        await fetchAnyUserData(userToken, '/api/calories/required').then(res=>{
            setRequiredCalories(res)
        })
    }

    async function retrieveUserConsumedCalories(){
        await fetchAnyUserData(userToken, '/api/calories/get').then(res=>{
            setConsumedCalories(res)
        })
    }

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
            headerImage={
                <Image
                    source={require('@/assets/images/partial-react-logo.png')}
                    style={styles.reactLogo}
                />
            }>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Salut {structuredUserInfo.name}
                </ThemedText>
                <HelloWave />
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Aujourd'hui tu a besoin de consommer un total de {requiredCalories} calories
                </ThemedText>
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Il te reste actuellement {consumedCalories} calories à consommer
                </ThemedText>
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Tu as donc consommé : {requiredCalories - consumedCalories} calories
                </ThemedText>
            </ThemedView>
        </ParallaxScrollView>

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
        alignItems: 'center',
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
        position: 'absolute',
    },
});
