import { Button, View } from 'react-native'
import React from 'react'
import AuthForm from '../components/AuthForm'
import AppText from '../../../components/ui/AppText'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { AuthStackParamList } from '../../../types/navigation'



const LoginScreen = ({ navigation }: NativeStackScreenProps<AuthStackParamList, 'Login'>) => {
  return (
    <View>
      <AppText>LoginScreen</AppText>
      <AuthForm signUp={false} />
      <Button onPress={() => navigation.navigate('SignUp')} title='Sign up' />
    </View>
  )
}

export default LoginScreen