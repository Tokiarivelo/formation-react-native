import { View } from 'react-native'
import React, { useEffect } from 'react'
import AppTextInput from '../../../components/ui/AppTextInput';
import AppDropdown from '../../../components/ui/AppDropdown';
import AppDateTimePicker from '../../../components/ui/AppDateTimePicker';
import AppPressable from '../../../components/ui/AppPressable';
import AppText from '../../../components/ui/AppText';
import { getErrorMessages } from '../../utils/errorUtils';
import { useNavigation } from '@react-navigation/native';
import { TaskResponseCount } from '../../../types/api';
import { useTaskForm } from '../hooks/useTaskForm';
import { TaskPriority, TaskStatus } from '../../../database/models/Task';

const TaskForm = ({ isUpdate, task, projectId }: { isUpdate: boolean, task?: TaskResponseCount, projectId: string }) => {
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
        <View>
            <AppTextInput
                placeholder="name"
                value={formData.title}
                onChangeText={(value) => updateField('title', value)}
                textContentType="name"
                autoComplete="name"
            />
            <AppTextInput
                placeholder="description"
                value={formData.description}
                onChangeText={(value) => updateField('description', value)}
            />
            <AppDropdown data={dropdownStatusOptions}
                handleChange={updateField}
                fieldName="status"
                value={formData.status} />
            <AppDropdown data={dropDownPriorityOptions}
                handleChange={updateField}
                fieldName="priority"
                value={formData.priority} />
            <AppDateTimePicker
                label='Due Date'
                value={formData.dueDate}
                onChange={(value) => updateField('dueDate', value)}
            />
            <AppPressable onPress={(handleSubmit)} disabled={isLoading}>
                <AppText>
                    {isUpdate ? (isLoading ? 'Updating' : "Update Task") : (isLoading ? 'Creating' : "Create Task")}
                </AppText>
            </AppPressable>

            {isError && (
                <View style={{ marginTop: 10 }}>
                    {getErrorMessages(error).map((msg, i) => (
                        <AppText key={i} style={{ color: 'red', marginBottom: 4 }}>
                            {msg}
                        </AppText>
                    ))}
                </View>
            )}
        </View>
    )
}

export default TaskForm