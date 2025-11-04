import { useState, useCallback } from 'react';
import { useCreateProject, useUpdateProject } from './useProjects';
import Project, { ProjectStatus } from '../../../database/models/Project';

export const useProjectForm = (isUpdate: boolean, project: Project | undefined) => {
    const [formData, setFormData] = useState({
        name: project?.name || "",
        description: project?.description || "",
        status: (project?.status || "ACTIVE") as ProjectStatus,
        startDate: project?.startDate?.toISOString() || "",
        endDate: project?.endDate?.toISOString() || "",
    });

    const {
        mutate: create,
        error: createError,
        isPending: createLoading,
        isError: createIsError,
        isSuccess: createIsSuccess,
    } = useCreateProject();

    const {
        mutate: update,
        error: updateError,
        isPending: updateLoading,
        isError: updateIsError,
        isSuccess: updateIsSuccess,
    } = useUpdateProject();

    const updateField = useCallback((field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);


    const handleSubmit = useCallback(() => {
        if (isUpdate) {
            update({ id: project!.id, projectParams: formData });
        }
        else {
            create(formData);
        }
    }, [formData, update, create, isUpdate, project]);

    const isLoading = createLoading || updateLoading;
    const error = isUpdate ? updateError : createError;
    const isError = isUpdate ? updateIsError : createIsError;
    const isSuccess = isUpdate ? updateIsSuccess : createIsSuccess;
    return {
        formData,
        updateField,
        handleSubmit,
        isLoading,
        error,
        isError,
        isSuccess,
    };
};