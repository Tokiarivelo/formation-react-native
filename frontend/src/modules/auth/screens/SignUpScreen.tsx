import { View } from 'react-native'
import React from 'react'
import AuthForm from '../components/AuthForm'

const SignUpScreen = () => {
    return (
        <View>
            <AuthForm signUp={true} />
        </View>
    )
}

export default SignUpScreen