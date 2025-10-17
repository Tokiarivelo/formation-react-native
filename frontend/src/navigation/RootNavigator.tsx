import { View, ActivityIndicator, StyleSheet } from 'react-native';
import renderAppStack from './AppStack';
import renderAuthStack from './AuthStack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';

const Root = createNativeStackNavigator();

const RootNavigator = () => {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const isLoading = useAuthStore((state) => state.isLoading);

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
