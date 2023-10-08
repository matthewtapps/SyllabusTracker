import { TechniqueStatus } from "./Types";

export interface StudentTechnique {
    userId: number;
    techniqueId: number;
    status: TechniqueStatus;
    studentNotes: string;
    coachNotes: string;
};
