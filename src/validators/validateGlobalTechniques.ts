import { Technique } from "../types/Technique";

function isValidTechnique(obj: any): obj is Technique {
    return typeof obj.techniqueId === 'number' && 
    typeof obj.name === 'string' && 
    typeof obj.videoSrc === 'string' &&
    typeof obj.imageSrc === 'string' &&
    typeof obj.description === 'string' &&
    typeof obj.globalNotes === 'string'
};

export function validateTechniques(obj: any): Technique[] {
    if (Array.isArray(obj) && obj.every(isValidTechnique)) {
        return obj;
    } else {
        throw new Error("Invalid global technique data")
    }
}
