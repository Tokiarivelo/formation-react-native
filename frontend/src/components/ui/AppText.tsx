import { Text, TextProps, StyleProp, ViewStyle, StyleSheet } from 'react-native'
import React from 'react'

type AppText = TextProps & {
    children: React.ReactNode,
    style?: StyleProp<ViewStyle>
}

const AppText = ({ children, style, ...props }: AppText) => {
    return (
        <Text style={[styles.text, style]} {...props}>{children}</Text>
    )
}
const styles = StyleSheet.create({
    text: {
    }
})
export default AppText