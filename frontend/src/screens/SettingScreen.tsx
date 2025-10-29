import { View } from 'react-native'
import React from 'react'
import AppPressable from '../components/ui/AppPressable';
import { useLogout } from '../modules/auth/hooks/useAuth';
import AppText from '../components/ui/AppText';
import AppSwitch from '../components/ui/AppSwitch';
import { useAuthStore } from '../store/authStore';
import { useDisableBiometric, useEnableBiometric } from '../modules/auth/hooks/useBiometricAuth';

const SettingScreen = () => {
    const biometricEnabled = useAuthStore((s) => s.biometricEnabled);
    const { mutate: enableBiometric } = useEnableBiometric();
    const { mutate: disableBiometric } = useDisableBiometric();
    const { mutateAsync: logoutAsync } = useLogout();
    const handleLogout = async () => {
        await logoutAsync();
    }
    const handleBiometricSwitch = async (value: boolean) => {
        if (value) {
            enableBiometric();
        }
        else {
            disableBiometric();
        }
    }
    return (
        <View>
            <AppSwitch
                value={biometricEnabled}
                onValueChange={handleBiometricSwitch}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={biometricEnabled ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
            />

            <AppText>Enable Biometrics?</AppText>

            <AppPressable onPress={handleLogout}>
                <AppText>
                    Logout
                </AppText>
            </AppPressable>
        </View>
    )
}

export default SettingScreen