import { Platform, StyleSheet, View } from 'react-native'
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

    const current = value ? new Date(value) : new Date();

    const handleOnChange = (event: any, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || new Date(value);
        onChange(currentDate.toISOString());
        setShowDateTimePicker(false);
    }
    return (
        <View style={styles.wrapper}>
            {/* LABEL */}
            <AppText style={styles.label}>{label}</AppText>
            <View style={styles.row}>

                {/* DATE STRING */}
                <AppText style={styles.valueText}>
                    {value ? new Date(value).toLocaleString() : 'No date selected'}
                </AppText>

                {/* BUTTONS */}
                <View style={styles.buttons}>
                    {/* PICK DATE BUTTON */}
                    <AppTouchableOpacity onPress={() => { setMode('date'); setShowDateTimePicker(true) }}
                        style={styles.smallButton}>
                        <AppText style={styles.smallButtonText}>Date</AppText>
                    </AppTouchableOpacity>

                    {/* PICK TIME BUTTON */}
                    <AppTouchableOpacity onPress={() => { setMode('time'); setShowDateTimePicker(true) }}
                        style={styles.smallButton}>
                        <AppText style={styles.smallButtonText}>Time</AppText>
                    </AppTouchableOpacity>
                </View>
            </View>
            {
                showDateTimePicker &&
                <DateTimePicker
                    value={current}
                    mode={mode}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleOnChange}
                />
            }
        </View>
    )
}
const styles = StyleSheet.create({
    wrapper: {
        marginBottom: 12,
    },
    label: {
        color: '#666',
        marginBottom: 6,
        fontWeight: '600',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: "wrap"
    },
    valueText: {
        color: '#222',
        fontSize: 14,
    },
    buttons: {
        flexDirection: 'row',
        gap: 8,
    },
    smallButton: {
        backgroundColor: '#eef6ff',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 8,
        marginLeft: 8,
    },
    smallButtonText: {
        color: '#1e88e5',
        fontWeight: '600',
    },
});
export default AppDateTimePicker