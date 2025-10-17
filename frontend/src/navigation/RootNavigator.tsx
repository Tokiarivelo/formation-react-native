import { View, ActivityIndicator, StyleSheet } from 'react-native';
import renderAppStack from './AppStack';
import renderAuthStack from './AuthStack';
import { useAuth } from '../modules/auth/hooks/useAuth';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Root = createNativeStackNavigator();

const RootNavigator = () => {
    const { isLoggedIn, isLoading } = useAuth();

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
