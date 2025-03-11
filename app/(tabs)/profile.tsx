import { StyleSheet, Image, Platform } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import {useContext} from "react";
import {AuthContext} from "@/context/authContext";
import {HelloWave} from "@/components/HelloWave";

export default function profile() {
    const auth = useContext(AuthContext);
    if (!auth) {
        return (
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Erreure AuthContext non défini !</ThemedText>
                <HelloWave />
            </ThemedView>
        )
    }

    const { userToken, logout, isLoading } = auth;

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
