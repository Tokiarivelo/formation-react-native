import { useState, useCallback } from 'react';
import { TaskResponseCount } from '../../../types/api';
import { TaskPriority, TaskStatus } from '../../../database/models/Task';
import { useCreateTask, useUpdateTaskById } from './useTasks';

export const useTaskForm = (isUpdate: boolean, projectId: string, task: TaskResponseCount | undefined) => {
    const [formData, setFormData] = useState({
        title: task?.title || "",
        description: task?.description || "",
        status: (task?.status || "TODO") as TaskStatus,
        priority: (task?.priority || "LOW") as TaskPriority,
        dueDate: task?.dueDate || "",
        projectId: projectId,
    });

    const {
        mutate: create,
        error: createError,
        isPending: createLoading,
        isError: createIsError,
        isSuccess: createIsSuccess,
    } = useCreateTask();

    const {
        mutate: update,
        error: updateError,
        isPending: updateLoading,
        isError: updateIsError,
        isSuccess: updateIsSuccess,
    } = useUpdateTaskById();

    const updateField = useCallback((field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);


    const handleSubmit = useCallback(() => {
        if (isUpdate) {
            const { title, description, status, priority, dueDate } = formData;
            update({ id: task!.id, taskParams: { title, description, status, priority, dueDate } });
        }
        else {
            create(formData);
        }
    }, [formData, update, create, isUpdate, task]);

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