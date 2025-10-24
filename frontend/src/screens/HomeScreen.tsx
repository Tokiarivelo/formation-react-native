import React from 'react';
import { View } from 'react-native';
import AppText from '../components/ui/AppText';
import AttachementPicker from '../modules/attachment/components/AttachementPicker';

const HomeScreen = () => {
    return (
        <View style={{ padding: 16 }}>
            <AppText style={{ fontWeight: 'bold' }}>HomeScreen</AppText>
            <AppText style={{ fontWeight: 'bold' }}>Welcome</AppText>
            <AttachementPicker />
        </View>
    );
};

export default HomeScreen;