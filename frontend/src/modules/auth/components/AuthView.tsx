import { ScrollView, StyleSheet, View } from 'react-native'
import React from 'react'

const AuthView = ({ children }: { children: React.ReactNode }) => {
    return (
        <ScrollView contentContainerStyle={styles.scrollContainer} >
            <View style={styles.container}>
                {children}
            </View>
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
        backgroundColor: '#f9f9f9',
    },
    container: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
});

export default AuthView