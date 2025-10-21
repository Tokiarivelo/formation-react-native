import { View } from 'react-native'
import React from 'react'
import AppPressable from '../components/ui/AppPressable';
import { useLogout } from '../modules/auth/hooks/useAuth';

const SettingScreen = () => {
    const { mutateAsync: logoutAsync } = useLogout();
    const handleLogout = async () => {
        await logoutAsync();
    }
    return (
        <View>
            <AppPressable onPress={handleLogout}>
                Logout
            </AppPressable>
        </View>
    )
}

export default SettingScreen