import { View } from 'react-native'
import React, { useEffect } from 'react'
import { useProjectForm } from '../hooks/useProjectForm';
import AppTextInput from '../../../components/ui/AppTextInput';
import AppDropdown from '../../../components/ui/AppDropdown';
import { ProjectStatus } from '../../../database/models/Project';
import AppDateTimePicker from '../../../components/ui/AppDateTimePicker';
import AppPressable from '../../../components/ui/AppPressable';
import AppText from '../../../components/ui/AppText';
import { getErrorMessages } from '../../utils/errorUtils';
import { useNavigation } from '@react-navigation/native';
import { ProjectResponseCount } from '../../../types/api';

const ProjectForm = ({ isUpdate, project = undefined }: { isUpdate: boolean, project?: ProjectResponseCount }) => {
    const navigation = useNavigation();
    const {
        formData,
        updateField,
        handleSubmit,
        isLoading,
        error,
        isError,
        isSuccess
    } = useProjectForm(isUpdate, project);

    useEffect(() => {

        if ((isSuccess)) {
            navigation.goBack();
        }
    }, [isSuccess, navigation]);

    const dropdownOptions = [
        { label: 'Active', value: ProjectStatus.ACTIVE },
        { label: 'Completed', value: ProjectStatus.COMPLETED },
        { label: 'On Hold', value: ProjectStatus.ON_HOLD },
        { label: 'Cancelled', value: ProjectStatus.CANCELLED },
    ];
    return (
        <View>
            <AppTextInput
                placeholder="name"
                value={formData.name}
                onChangeText={(value) => updateField('name', value)}
                textContentType="name"
                autoComplete="name"
            />
            <AppTextInput
                placeholder="description"
                value={formData.description}
                onChangeText={(value) => updateField('description', value)}
            />
            <AppDropdown data={dropdownOptions}
                handleChange={updateField}
                fieldName="status"
                value={formData.status} />
            <AppDateTimePicker
                label='Start Date'
                value={formData.startDate}
                onChange={(value) => updateField('startDate', value)}
            />
            <AppDateTimePicker
                label='End Date'
                value={formData.endDate}
                onChange={(value) => updateField('endDate', value)}
            />
            <AppPressable onPress={(handleSubmit)} disabled={isLoading}>
                <AppText>
                    {isUpdate ? (isLoading ? 'Updating' : "Update Project") : (isLoading ? 'Creating' : "Create Project")}
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

export default ProjectForm