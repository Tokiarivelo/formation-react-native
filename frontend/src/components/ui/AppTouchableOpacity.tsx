import { TouchableOpacityProps, StyleProp, ViewStyle, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import AppText from './AppText'
type AppTouchableOpacity = TouchableOpacityProps & {
    children: React.ReactNode,
    style?: StyleProp<ViewStyle>
}
const AppTouchableOpacity = ({ children, style, ...props }: TouchableOpacityProps) => {
    return (
        <TouchableOpacity style={[styles.touchableOpacity, style]} {...props}>
            <AppText>{children}</AppText>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    touchableOpacity: {
        backgroundColor: "blue",
        borderRadius: 50,
    }
})
export default AppTouchableOpacity