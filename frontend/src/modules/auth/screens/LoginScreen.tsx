import { Button, View } from 'react-native'
import React from 'react'
import AuthForm from '../components/AuthForm'
import AppText from '../../../components/ui/AppText'

const LoginScreen = ({ navigation }: { navigation: any }) => {

  return (
    <View>
      <AppText>LoginScreen</AppText>
      <AuthForm signUp={false} />
      <Button onPress={() => navigation.navigate("SignUp")} title='Sign up' />
    </View>
  )
}

export default LoginScreen