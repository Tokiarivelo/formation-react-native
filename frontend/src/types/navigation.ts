import { NavigatorScreenParams } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

//PROJECT 
export type ProjectStackParamList = {
    ProjectList: undefined;
    ProjectDetail: { projectId: string };
    ProjectUpdate: { projectId: string };
    ProjectCreate: undefined;
    Tasks: NavigatorScreenParams<TaskStackParamList>;
};

export type ProjectStackScreenProps<T extends keyof ProjectStackParamList> =
    NativeStackScreenProps<ProjectStackParamList, T>;



//AUTH
export type AuthStackParamList = {
    SignUp: undefined,
    Login: undefined,
};

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
    NativeStackScreenProps<AuthStackParamList, T>;


//TASKS
export type TaskStackParamList = {
    TaskList: undefined;
    TaskDetail: { taskId: string };
    TaskCreate: { projectId: string };
    TaskUpdate: { taskId: string, projectId: string };
};

export type TaskStackScreenProps<T extends keyof TaskStackParamList> =
    NativeStackScreenProps<TaskStackParamList, T>;