import { Button, Text, View } from 'react-native'
import React from 'react'
import AuthForm from '../components/AuthForm'

const LoginScreen = ({ navigation }: { navigation: any }) => {

  return (
    <View>
      <AuthForm signUp={false} />
      <Text>LoginScreen</Text>
      <Button onPress={() => navigation.navigate("SignUp")} title='Sign up' />
    </View>
  )
}

export default LoginScreen