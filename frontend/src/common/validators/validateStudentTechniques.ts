import { StudentTechnique } from "../types/StudentTechnique";
import { TechniqueStatus } from "../types/enums/TechniqueStatus";

function isValidTechnique(obj: any): obj is StudentTechnique {
    return typeof obj.userId === 'number' && 
    typeof obj.techniqueId === 'number' && 
    Object.values(TechniqueStatus).includes(obj.status) &&
    typeof obj.studentNotes === 'string' &&
    typeof obj.coachNotes === 'string'
};

export function validateStudentTechniques(obj: any): StudentTechnique[] {
    if (Array.isArray(obj) && obj.every(isValidTechnique)) {
        return obj;
    } else {
        const invalidItem: any = obj.find((item: any) => !isValidTechnique(item));
        throw new Error(`Invalid student technique data: ${JSON.stringify(invalidItem, null, 2)}`);
    }
};
