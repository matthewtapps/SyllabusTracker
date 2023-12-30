import { TechniqueStatus, Technique } from "./Types";
export interface StudentTechnique {
    studentTechniqueId: string;
    userId: string;
    technique: Technique;
    status: TechniqueStatus;
    studentNotes: string;
    coachNotes: string;
    lastUpdated: Date;
    created: Date;
}
