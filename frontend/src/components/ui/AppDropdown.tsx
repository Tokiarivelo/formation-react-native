import { StyleProp, StyleSheet, ViewStyle } from 'react-native'
import React from 'react'
import { Dropdown } from 'react-native-element-dropdown';

type dropdownType = {
    label: string,
    value: string
}

type AppDropdownType = {
    data: Array<dropdownType>,
    style?: StyleProp<ViewStyle>
    textStyle?: StyleProp<ViewStyle>
    handleChange: (field: any, value: string) => void,
    fieldName: string,
    value: string,
}

const AppDropdown = ({ data, style, textStyle, handleChange, fieldName, value }: AppDropdownType) => {
    return (
        <Dropdown
            style={[styles.dropdown, style]}
            data={data}
            labelField="label"
            valueField="value"
            itemTextStyle={[styles.itemText, textStyle]}
            activeColor="#eef6ff"
            containerStyle={styles.containerStyle}
            onChange={(v: any) => handleChange(fieldName, v.value)}
            value={value}
        />
    )
}

const styles = StyleSheet.create({
    dropdown: {
        backgroundColor: '#f7f9fc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 10,
        fontSize: 16,
        marginBottom: 12,
    },
    placeholder: {
        color: '#9aa4b2',
    },
    selectedText: {
        color: '#222',
    },
    itemText: {
        color: '#222',
    },
    containerStyle: {
        borderRadius: 10,
    },
});

export default AppDropdown