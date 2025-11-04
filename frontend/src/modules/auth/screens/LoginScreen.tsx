import { StyleSheet } from 'react-native'
import React from 'react'
import AuthForm from '../components/AuthForm'
import AppText from '../../../components/ui/AppText'
import { AuthStackScreenProps } from '../../../types/navigation'
import { useAuthStore } from '../../../store/authStore'
import { useBiometricAvailability, useBiometricLogin } from '../hooks/useBiometricAuth'
import AppTouchableOpacity from '../../../components/ui/AppTouchableOpacity'
import AuthView from '../components/AuthView'

type Props = AuthStackScreenProps<'Login'>

const LoginScreen = ({ navigation }: Props) => {
  const lastUserState = useAuthStore((s) => s.lastUserState);
  const { data: isBiometricAvailable } = useBiometricAvailability();
  const { mutate: biometricLogin } = useBiometricLogin();
  return (
    <AuthView>
      {/* AUTHENTICATION FORM */}
      <AuthForm signUp={false} />

      {/* GO TO SIGN UP BUTTON */}
      <AppTouchableOpacity onPress={() => navigation.navigate('SignUp')} style={styles.signUpButton}>
        <AppText>No account yet? register here</AppText>
      </AppTouchableOpacity>


      {/* BIOMETRIC AUTHENTICATION BUTTON */}
      {
        (lastUserState?.biometricEnabled && isBiometricAvailable) && (
          <AppTouchableOpacity onPress={() => biometricLogin(lastUserState.id)}>
            <AppText> Use Biometric Authentication for {lastUserState?.firstName} {lastUserState?.lastName} </AppText>
          </AppTouchableOpacity>
        )
      }
    </AuthView>
  )
}

const styles = StyleSheet.create({
  signUpButton: {
    backgroundColor: "transparent",
  }
})

export default LoginScreen