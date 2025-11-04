import { TouchableOpacityProps, StyleProp, ViewStyle, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
type AppTouchableOpacity = TouchableOpacityProps & {
    children: React.ReactNode,
    style?: StyleProp<ViewStyle>
}
const AppTouchableOpacity = ({ children, style, ...props }: TouchableOpacityProps) => {
    return (
        <TouchableOpacity style={[styles.button, style]} {...props}>
            {children}
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    button: {
        backgroundColor: '#007AFF',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
})
export default AppTouchableOpacity