import { View, Text } from 'react-native'
import React from 'react'
import { useAuthStore } from '../store/authStore';

const ProfileScreen = () => {
    const userState = useAuthStore((state) => state.userState);
    return (
        <View>
            <Text>Id: {userState?.id}</Text>
            <Text>email: {userState?.email}</Text>
            <Text>Username: {userState?.username}</Text>
            <Text>first Name: {userState?.firstName}</Text>
            <Text>last Name: {userState?.lastName}</Text>
            <Text>is active: {userState?.isActive ? "yes" : "no"}</Text>
            <Text>Role: {userState?.role}</Text>
            <Text>created at: {userState?.createdAt}</Text>
            <Text>updated at: {userState?.updatedAt}</Text>
        </View>
    )
}

export default ProfileScreen