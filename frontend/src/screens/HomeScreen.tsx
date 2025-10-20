import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { useLogout } from '../modules/auth/hooks/useAuth';

const HomeScreen = () => {
    const { logoutAsync } = useLogout();
    const userState = useAuthStore((state) => state.userState);

    const handleLogout = async () => {
        await logoutAsync();
    }

    return (
        <View style={{ padding: 16 }}>
            <Text style={{ fontWeight: 'bold' }}>HomeScreen</Text>
            <Text style={{ fontWeight: 'bold' }}>Welcome</Text>
            <Text>Id: {userState?.id}</Text>
            <Text>email: {userState?.email}</Text>
            <Text>Username: {userState?.username}</Text>
            <Text>first Name: {userState?.firstName}</Text>
            <Text>last Name: {userState?.lastName}</Text>
            <Text>is active: {userState?.isActive}</Text>
            <Text>Role: {userState?.role}</Text>
            <Text>created at: {userState?.createdAt}</Text>
            <Text>updated at: {userState?.updatedAt}</Text>
            <Button title="logout" onPress={handleLogout} />
        </View>
    );
};

export default HomeScreen;