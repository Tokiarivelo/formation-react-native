import { View } from 'react-native'
import React from 'react'
import AuthForm from '../components/AuthForm'

const LoginScreen = () => {
  return (
    <View>
      <AuthForm signUp={false} />
    </View>
  )
}

export default LoginScreen