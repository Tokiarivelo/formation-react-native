import { View } from 'react-native'
import React from 'react'
import { useAuthStore } from '../store/authStore';
import AppText from '../components/ui/AppText';

const ProfileScreen = () => {
    const userState = useAuthStore((state) => state.userState);
    return (
        <View>
            <AppText>Id: {userState?.id}</AppText>
            <AppText>email: {userState?.email}</AppText>
            <AppText>Username: {userState?.username}</AppText>
            <AppText>first Name: {userState?.firstName}</AppText>
            <AppText>last Name: {userState?.lastName}</AppText>
            <AppText>is active: {userState?.isActive ? "yes" : "no"}</AppText>
            <AppText>Role: {userState?.role}</AppText>
            <AppText>created at: {userState?.createdAt}</AppText>
            <AppText>updated at: {userState?.updatedAt}</AppText>
        </View>
    )
}

export default ProfileScreen