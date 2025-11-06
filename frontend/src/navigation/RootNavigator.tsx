import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import renderAppStack from './AppStack';
import renderAuthStack from './AuthStack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import { useEffect } from 'react';
import { useLogout } from '../modules/auth/hooks/useAuth';
import { clearOnLogout, setOnLogout } from '../services/navigationService';
import { mySync } from '../services/syncService';
import { useNetInfo } from '@react-native-community/netinfo';

const Root = createNativeStackNavigator();

const RootNavigator = () => {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const isLoading = useAuthStore((state) => state.isLoading);
    const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);
    const { mutate: logout } = useLogout();

    const { isConnected } = useNetInfo();

    //setOnLogOut that is called when a logout is triggered
    useEffect(() => {
        setOnLogout(() => logout);
        return () => clearOnLogout();
    }, [logout]);

    useEffect(() => {
        const check = async () => {
            await checkAuthStatus();
        }
        if (isConnected) {
            check();
            if (isLoggedIn) {
                const delay = Platform.OS === 'android' ? 500 : 200;
                setTimeout(() => {
                    mySync();
                }, delay);
            }
        }
    }, [checkAuthStatus, isConnected, isLoggedIn]);

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <Root.Navigator screenOptions={{ headerShown: false }}>
            {isLoggedIn ? (
                renderAppStack()
            ) : (
                renderAuthStack()
            )}
        </Root.Navigator>
    )
};

export default RootNavigator;

const styles = StyleSheet.create({
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
