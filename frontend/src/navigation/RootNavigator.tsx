import renderAppStack from './AppStack';
import renderAuthStack from './AuthStack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { useLogout } from '../modules/auth/hooks/useAuth';
import { clearOnLogout, setOnLogout } from '../services/navigationService';

const Root = createNativeStackNavigator();

const RootNavigator = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
    const { mutate: logout } = useLogout();

    //setOnLogOut that is called when a logout is triggered
    useEffect(() => {
        setOnLogout(() => logout);
        return () => clearOnLogout();
    }, [logout]);

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
