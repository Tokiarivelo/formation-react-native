import { View } from 'react-native'
import React from 'react'
import { useLogout } from '../modules/auth/hooks/useAuth';
import AppText from '../components/ui/AppText';
import AppSwitch from '../components/ui/AppSwitch';
import { useAuthStore } from '../store/authStore';
import { useDisableBiometric, useEnableBiometric } from '../modules/auth/hooks/useBiometricAuth';
import AppTouchableOpacity from '../components/ui/AppTouchableOpacity';
import { mySync } from '../services/syncService';
import { useNetInfo } from '@react-native-community/netinfo';

const SettingScreen = () => {
    const biometricEnabled = useAuthStore((s) => s.biometricEnabled);
    const { isConnected } = useNetInfo();
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

    const handleSync = async () => {
        try {
            await mySync();
            console.log("sync successfull");
        }
        catch (error) {
            console.log("sync failed", error);
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

            <AppTouchableOpacity onPress={handleSync}>
                <AppText>
                    Sync now
                </AppText>
            </AppTouchableOpacity>
            <AppTouchableOpacity onPress={handleLogout} disabled={!isConnected}>
                <AppText>
                    Logout
                </AppText>
            </AppTouchableOpacity>
        </View>
    )
}

export default SettingScreen