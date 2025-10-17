import { Text, View } from 'react-native'
import React from 'react'
import AuthForm from '../components/AuthForm'

const LoginScreen = () => {

  // if (loading) {
  //   return (
  //     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
  //       <ActivityIndicator />
  //     </View>
  //   );
  // }

  return (
    <View>
      <AuthForm signUp={false} />
      <Text>LoginScreen</Text>
    </View>
  )
}

export default LoginScreen