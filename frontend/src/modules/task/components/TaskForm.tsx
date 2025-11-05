import { ScrollView, StyleSheet, View } from 'react-native'
import React, { useEffect } from 'react'
import AppTextInput from '../../../components/ui/AppTextInput';
import AppDropdown from '../../../components/ui/AppDropdown';
import AppDateTimePicker from '../../../components/ui/AppDateTimePicker';
import AppPressable from '../../../components/ui/AppPressable';
import AppText from '../../../components/ui/AppText';
import { getErrorMessages } from '../../utils/errorUtils';
import { useNavigation } from '@react-navigation/native';
import { useTaskForm } from '../hooks/useTaskForm';
import Task, { TaskPriority, TaskStatus } from '../../../database/models/Task';

const TaskForm = ({ isUpdate, task, projectId }: { isUpdate: boolean, task?: Task, projectId: string }) => {
    const navigation = useNavigation();
    const {
        formData,
        updateField,
        handleSubmit,
        isLoading,
        error,
        isError,
        isSuccess
    } = useTaskForm(isUpdate, projectId, task);

    useEffect(() => {

        if ((isSuccess)) {
            navigation.goBack();
        }
    }, [isSuccess, navigation]);

    const dropdownStatusOptions = [
        { label: 'To Do', value: TaskStatus.TODO },
        { label: 'In Progress', value: TaskStatus.IN_PROGRESS },
        { label: 'Done', value: TaskStatus.DONE },
        { label: 'Cancelled', value: TaskStatus.CANCELLED },
    ];

    const dropDownPriorityOptions = [
        { label: 'Low', value: TaskPriority.LOW },
        { label: 'Medium', value: TaskPriority.MEDIUM },
        { label: 'High', value: TaskPriority.HIGH },
        { label: 'Urgent', value: TaskPriority.URGENT },
    ];
    return (
        <ScrollView contentContainerStyle={styles.screen} keyboardShouldPersistTaps="handled">
            <View style={styles.card}>
                <AppText style={styles.title}>{isUpdate ? 'Update Task' : 'Create Task'}</AppText>

                <AppTextInput
                    placeholder="Title"
                    value={formData.title}
                    onChangeText={(value) => updateField('title', value)}
                    textContentType="name"
                    autoComplete="name"
                    style={styles.input}
                />

                <AppTextInput
                    placeholder="Description (optional)"
                    value={formData.description}
                    onChangeText={(value) => updateField('description', value)}
                    style={[styles.input, styles.multiline]}
                    multiline
                    numberOfLines={3}
                />

                <View style={styles.row}>
                    <View style={styles.half}>
                        <AppDropdown
                            data={dropdownStatusOptions}
                            handleChange={updateField}
                            fieldName="status"
                            value={formData.status}
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.half}>
                        <AppDropdown
                            data={dropDownPriorityOptions}
                            handleChange={updateField}
                            fieldName="priority"
                            value={formData.priority}
                            style={styles.input}
                        />
                    </View>
                </View>

                <AppDateTimePicker
                    label="Due Date"
                    value={formData.dueDate}
                    onChange={(value) => updateField('dueDate', value)}
                />

                <AppPressable
                    onPress={handleSubmit as any}
                    disabled={isLoading}
                    style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
                >
                    <AppText style={styles.primaryButtonText}>
                        {isLoading ? (isUpdate ? 'Updating…' : 'Creating…') : isUpdate ? 'Update Task' : 'Create Task'}
                    </AppText>
                </AppPressable>

                {isError && (
                    <View style={styles.errorBox}>
                        {getErrorMessages(error).map((msg, i) => (
                            <AppText key={i} style={styles.errorText}>
                                {msg}
                            </AppText>
                        ))}
                    </View>
                )}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    screen: {
        padding: 16,
        paddingBottom: 40,
        backgroundColor: '#f6f7fb',
        flexGrow: 1,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
        color: '#222',
    },
    input: {
        marginBottom: 12,
    },
    multiline: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    row: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 8,
    },
    half: {
        flex: 1,
    },
    primaryButton: {
        marginTop: 12,
        backgroundColor: '#1e88e5',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    errorBox: {
        marginTop: 12,
        padding: 10,
        backgroundColor: '#fff6f6',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#f3c1c1',
    },
    errorText: {
        color: '#d32f2f',
        fontSize: 13,
        marginBottom: 4,
    },
});

export default TaskForm