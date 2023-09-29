import { StudentTechnique } from "../types/StudentTechnique";
import { TechniqueStatus, stringToTechniqueStatus } from "../types/enums/TechniqueStatus";

function isValidTechnique(obj: any): obj is StudentTechnique {
    return typeof obj.userId === 'number' && 
    typeof obj.techniqueId === 'number' && 
    Object.values(TechniqueStatus).includes(obj.status) &&
    typeof obj.studentNotes === 'string' &&
    typeof obj.coachNotes === 'string' &&
    typeof obj.globalNotes === 'string'
};

export function validateStudentTechniques(obj: any): StudentTechnique[] {
    if (obj.every(isValidTechnique)) {
        return obj;
    } else {
        throw new Error("Invalid technique data")
    }
};
