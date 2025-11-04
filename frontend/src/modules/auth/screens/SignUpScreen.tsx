import React from 'react'
import AuthForm from '../components/AuthForm'
import AuthView from '../components/AuthView'
import AppTouchableOpacity from '../../../components/ui/AppTouchableOpacity'
import { StyleSheet } from 'react-native'
import AppText from '../../../components/ui/AppText'
import { AuthStackScreenProps } from '../../../types/navigation'

type Props = AuthStackScreenProps<'SignUp'>;

const SignUpScreen = ({ navigation }: Props) => {
    return (
        <AuthView>
            {/* AUTHENTICATION FORM */}
            <AuthForm signUp={true} />

            {/* GO TO LOGIN BUTTON */}
            <AppTouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.signUpButton}>
                <AppText>Already have an account? Log in here</AppText>
            </AppTouchableOpacity>
        </AuthView>
    )
}

const styles = StyleSheet.create({
    signUpButton: {
        backgroundColor: "transparent",
    }
})

export default SignUpScreen