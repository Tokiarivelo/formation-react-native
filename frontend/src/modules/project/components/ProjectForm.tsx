// ProjectForm.tsx
import React, { useEffect } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppTextInput from '../../../components/ui/AppTextInput';
import AppDropdown from '../../../components/ui/AppDropdown';
import AppDateTimePicker from '../../../components/ui/AppDateTimePicker';
import AppTouchableOpacity from '../../../components/ui/AppTouchableOpacity';
import AppText from '../../../components/ui/AppText';
import { getErrorMessages } from '../../utils/errorUtils';
import { useProjectForm } from '../hooks/useProjectForm';
import Project, { ProjectStatus } from '../../../database/models/Project';

const ProjectForm = ({ isUpdate, project }: { isUpdate: boolean; project?: Project }) => {
    const navigation = useNavigation();
    const { formData, updateField, handleSubmit, isLoading, error, isError, isSuccess } =
        useProjectForm(isUpdate, project);

    useEffect(() => {
        if (isSuccess) navigation.goBack();
    }, [isSuccess, navigation]);

    const dropdownOptions = [
        { label: 'Active', value: ProjectStatus.ACTIVE },
        { label: 'Completed', value: ProjectStatus.COMPLETED },
        { label: 'On Hold', value: ProjectStatus.ON_HOLD },
        { label: 'Cancelled', value: ProjectStatus.CANCELLED },
    ];

    return (
        <ScrollView contentContainerStyle={styles.screen} keyboardShouldPersistTaps="handled">
            <View style={styles.card}>
                <AppText style={styles.title}>{isUpdate ? 'Update Project' : 'Create Project'}</AppText>

                <AppTextInput
                    placeholder="Project name"
                    value={formData.name}
                    onChangeText={(value) => updateField('name', value)}
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

                <AppDropdown
                    data={dropdownOptions}
                    handleChange={updateField}
                    fieldName="status"
                    value={formData.status}
                    style={styles.input}
                />

                <View style={styles.row}>
                    <View style={styles.half}>
                        <AppDateTimePicker
                            label="Start"
                            value={formData.startDate}
                            onChange={(val) => updateField('startDate', val)}
                        />
                    </View>
                    <View style={styles.half}>
                        <AppDateTimePicker
                            label="End"
                            value={formData.endDate}
                            onChange={(val) => updateField('endDate', val)}
                        />
                    </View>
                </View>

                {isError && (
                    <View style={styles.errorBox}>
                        {getErrorMessages(error).map((msg, i) => (
                            <AppText key={i} style={styles.errorText}>
                                {msg}
                            </AppText>
                        ))}
                    </View>
                )}

                <AppTouchableOpacity
                    onPress={handleSubmit as any}
                    disabled={isLoading}
                    style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
                >
                    <AppText style={styles.primaryButtonText}>
                        {isLoading ? (isUpdate ? 'Updating…' : 'Creating…') : isUpdate ? 'Update Project' : 'Create Project'}
                    </AppText>
                </AppTouchableOpacity>

                <AppTouchableOpacity onPress={() => navigation.goBack()} style={styles.ghostButton}>
                    <AppText style={styles.ghostText}>Cancel</AppText>
                </AppTouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    screen: {
        padding: 16,
        paddingBottom: 40,
        backgroundColor: '#f6f7fb',
        flexGrow: 1,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 14,
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
        marginTop: 6,
    },
    half: {
        flex: 1,
    },
    errorBox: {
        marginVertical: 8,
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
    ghostButton: {
        marginTop: 10,
        alignItems: 'center',
        paddingVertical: 12,
        backgroundColor: "#d8d2d2ff"
    },
    ghostText: {
        color: '#666',
        fontWeight: '600',
    },
});

export default ProjectForm;
