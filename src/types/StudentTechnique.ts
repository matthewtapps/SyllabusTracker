import { TechniqueStatus } from "./enums/TechniqueStatus";

export interface StudentTechnique {
    userId: number;
    techniqueId: number;
    status: TechniqueStatus;
    studentNotes: string;
    coachNotes: string;
};
