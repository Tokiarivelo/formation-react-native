import { Pressable, PressableProps, StyleSheet } from 'react-native'
import React, { ReactNode } from 'react'

import { StyleProp, ViewStyle } from 'react-native'

type AppPressableType = PressableProps & {
  children: ReactNode,
  style?: StyleProp<ViewStyle>
}

const AppPressable = ({ children, style, ...props }: AppPressableType) => {
  return (
    <Pressable style={[styles.pressable, style]} {...props}>
      {children}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  pressable: {
    backgroundColor: "green",
    borderRadius: 50,
  }
})

export default AppPressable