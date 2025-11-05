import { ProjectStatus } from "../database/models/Project";
import { TaskPriority, TaskStatus } from "../database/models/Task";

type projectFormData = {
    name: string;
    description: string;
    status: ProjectStatus;
    startDate: string;
    endDate: string;
}

type taskFormData = {
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string;
    projectId: string;
}
export function projectFormValidation(formData: projectFormData): string[] {
    const errors: string[] = [];
    if (!formData.name.trim()) errors.push('Project name is required');
    if (!Object.values(ProjectStatus).includes(formData.status)) errors.push('Select a valid status')
    if (!formData.startDate || !formData.endDate) errors.push('Please select valid date');
    if (formData.startDate && formData.endDate) {
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        if (end < start) errors.push("End date cannot be earlier than start date.");
    }
    return errors;
}

export function taskFormValidation(formData: taskFormData): string[] {
    const errors: string[] = [];
    if (!formData.title.trim()) errors.push('Task title is required');
    if (!Object.values(TaskStatus).includes(formData.status)) errors.push('Select a valid status');
    if (!Object.values(TaskPriority).includes(formData.priority)) errors.push('Select a valid priority');
    if (!formData.dueDate) errors.push('Please select valid due date');
    if (new Date(formData.dueDate) < new Date()) errors.push("Due date cannot be earlier than now")
    return errors;
}