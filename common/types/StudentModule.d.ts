import { User, Technique } from './Types';
export interface StudentTechnique {
    studentModuleId: string;
    user: User;
    technique: Technique;
    studentNotes: string;
    coachNotes: string;
}
