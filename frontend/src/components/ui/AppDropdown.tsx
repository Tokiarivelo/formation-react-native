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
    handleChange: (field: any, value: string) => void,
    fieldName: string,
    value: string,
}

const AppDropdown = ({ data, style, handleChange, fieldName, value }: AppDropdownType) => {
    return (
        <Dropdown style={[styles.dropdown, style]}
            data={data}
            placeholder="Select Status"
            labelField="label"
            valueField="value"
            placeholderStyle={styles.textStyle}
            selectedTextStyle={styles.textStyle}
            onChange={(v: any) => { handleChange(fieldName, v.value) }}
            value={value}
        />
    )
}

const styles = StyleSheet.create({
    dropdown: {
    },
    textStyle: {
    }
})

export default AppDropdown