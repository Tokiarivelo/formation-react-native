import { ProjectResponseCount } from "./api";

//PROJECT 
export type ProjectStackParamList = {
    ProjectList: undefined;
    ProjectDetail: { projectId: string };
    ProjectUpdate: { project: ProjectResponseCount };
    ProjectCreate: undefined;
};

//AUTH
export type AuthStackParamList = {
    SignUp: undefined,
    Login: undefined,
}