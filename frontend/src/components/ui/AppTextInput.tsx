import { TextInput, StyleSheet, TextInputProps } from 'react-native'
import React from 'react'

type AppTextInputType = TextInputProps & {
  style?: object,
  secure?: boolean
}

const AppTextInput = ({ style, secure, ...props }: AppTextInputType) => {
  return (
    <TextInput
      style={[styles.input, style]}
      secureTextEntry={secure}
      autoCapitalize="none"
      autoCorrect={false}
      {...props} />
  )
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#d2d2d2",
    borderRadius: 50,
  }
})

export default AppTextInput