import { TechniqueStatus, User, Technique } from "./Types";
export interface StudentTechnique {
    studentTechniqueId: string;
    user: User;
    technique: Technique;
    status: TechniqueStatus;
    studentNotes: string;
    coachNotes: string;
}
