import { NavigatorScreenParams } from "@react-navigation/native";
import { ProjectResponseCount, TaskResponseCount } from "./api";

//PROJECT 
export type ProjectStackParamList = {
    ProjectList: undefined;
    ProjectDetail: { projectId: string };
    ProjectUpdate: { project: ProjectResponseCount };
    ProjectCreate: undefined;
    Tasks: NavigatorScreenParams<TaskStackParamList>;
};

//AUTH
export type AuthStackParamList = {
    SignUp: undefined,
    Login: undefined,
}

//TASKS
export type TaskStackParamList = {
    TaskList: undefined;
    TaskDetail: { taskId: string };
    TaskCreate: { projectId: string };
    TaskUpdate: { task: TaskResponseCount, projectId: string };
};