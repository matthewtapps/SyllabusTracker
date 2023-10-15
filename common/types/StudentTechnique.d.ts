import { TechniqueStatus } from "./Types";
export interface StudentTechnique {
    userId: string;
    techniqueId: string;
    status: TechniqueStatus;
    studentNotes: string;
    coachNotes: string;
}
