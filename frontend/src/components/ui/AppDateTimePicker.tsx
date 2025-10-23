import { View } from 'react-native'
import React, { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import AppTouchableOpacity from './AppTouchableOpacity';
import AppText from './AppText';

type AppDateTimePickerType = {
    value: string,
    label: string,
    onChange: (value: string) => void,
}

const AppDateTimePicker = ({ value, label, onChange }: AppDateTimePickerType) => {
    const [mode, setMode] = useState<'date' | 'time'>('date');
    const [showDateTimePicker, setShowDateTimePicker] = useState(false);

    const handleOnChange = (event: any, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || new Date(value);
        onChange(currentDate.toISOString());
        setShowDateTimePicker(false);
    }
    return (
        <View>
            <AppText>{label} : {value ? new Date(value).toLocaleString() : ""}</AppText>
            <AppTouchableOpacity onPress={() => { setMode('date'); setShowDateTimePicker(true) }}>
                <AppText>Select Date</AppText>
            </AppTouchableOpacity>
            <AppTouchableOpacity onPress={() => { setMode('time'); setShowDateTimePicker(true) }}>
                <AppText>Select Time</AppText>
            </AppTouchableOpacity>
            {
                showDateTimePicker &&
                <DateTimePicker mode={mode} value={new Date()} onChange={handleOnChange} />
            }
        </View>
    )
}

export default AppDateTimePicker