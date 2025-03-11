import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {useContext, useEffect} from "react";
import {AuthContext} from "@/context/authContext";
import {HelloWave} from "@/components/HelloWave";
import {useRouter} from "expo-router";
import {UserContext} from "@/context/userContext";

export default function profile() {
    const auth = useContext(AuthContext);
    const info = useContext(UserContext);
    const router = useRouter()
    if (!auth) {
        return (
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Erreure AuthContext non défini !</ThemedText>
                <HelloWave />
            </ThemedView>
        )
    }

    const { userToken, logout, isLoading } = auth;

    useEffect(() => {
        if (!isLoading && !userToken) {
            router.push("/registration/login")
        }
        if (!isLoading){
        }
    })
    return (
        <h1>truc</h1>
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
    },
});
