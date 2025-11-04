import { TextInput, StyleSheet, TextInputProps } from 'react-native'
import React from 'react'

type AppTextInputType = TextInputProps & {
  style?: object
  secure?: boolean
}

const AppTextInput = ({ style, secure, ...props }: AppTextInputType) => {
  return (
    <TextInput
      style={[styles.input, style]}
      secureTextEntry={secure}
      autoCapitalize="none"
      autoCorrect={false}
      placeholderTextColor="#888"
      {...props}
    />
  )
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    fontSize: 16,
    color: '#222',
  },
})

export default AppTextInput
