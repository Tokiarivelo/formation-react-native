import { Button, Text, View } from 'react-native'
import React from 'react'
import AuthForm from '../components/AuthForm'

const LoginScreen = ({ navigation }: { navigation: any }) => {

  return (
    <View>
      <Text>LoginScreen</Text>
      <AuthForm signUp={false} />
      <Button onPress={() => navigation.navigate("SignUp")} title='Sign up' />
    </View>
  )
}

export default LoginScreen