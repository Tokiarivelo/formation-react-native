import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Button } from 'react-native';
import { getAccessToken, getRefreshToken } from '../modules/auth/tokenStore';
import { useAuth } from '../modules/auth/hooks/useAuth';

const HomeScreen = () => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const { logout } = useAuth();

    //JUST FOR TESTING PURPOSE --- REMOVE LATER
    console.log("access : ", accessToken);
    console.log("refresh : ", refreshToken);
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                // await the async token getters
                const a = await getAccessToken();
                const r = await getRefreshToken();
                if (!mounted) return;
                setAccessToken(a ?? null);
                setRefreshToken(r ?? null);
            } catch (err) {
                console.error('Failed to read tokens', err);
                if (mounted) {
                    setAccessToken(null);
                    setRefreshToken(null);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator />
            </View>
        );
    }

    const handleLogout = async () => {
        await logout.mutateAsync();
    }

    return (
        <View style={{ padding: 16 }}>
            <Text style={{ fontWeight: 'bold' }}>HomeScreen</Text>

            {/*JUST FOR TESTING PURPOSE --- REMOVE LATER*/}
            <Text>AccessToken: {accessToken ?? 'null'}</Text>
            <Text>RefreshToken: {refreshToken ?? 'null'}</Text>
            <Button title="logout" onPress={handleLogout} />
        </View>
    );
};

export default HomeScreen;