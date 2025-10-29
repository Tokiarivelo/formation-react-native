import { Button, View } from 'react-native'
import React from 'react'
import AuthForm from '../components/AuthForm'
import AppText from '../../../components/ui/AppText'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { AuthStackParamList } from '../../../types/navigation'
import AppPressable from '../../../components/ui/AppPressable'
import { useAuthStore } from '../../../store/authStore'
import { useBiometricAvailability, useBiometricLogin } from '../hooks/useBiometricAuth'



const LoginScreen = ({ navigation }: NativeStackScreenProps<AuthStackParamList, 'Login'>) => {
  const lastUserState = useAuthStore((s) => s.lastUserState);
  const { data: isBiometricAvailable } = useBiometricAvailability();
  console.log("last user state :", lastUserState);
  const { mutate: biometricLogin } = useBiometricLogin();
  return (
    <View>
      <AppText>LoginScreen</AppText>
      <AuthForm signUp={false} />
      <Button onPress={() => navigation.navigate('SignUp')} title='Sign up' />
      {
        (lastUserState?.biometricEnabled && isBiometricAvailable) && (
          <AppPressable onPress={() => biometricLogin(lastUserState.id)}>
            <AppText> Use Biometric Authentication for {lastUserState?.firstName} {lastUserState?.lastName} </AppText>
          </AppPressable>
        )
      }
    </View>
  )
}

export default LoginScreen