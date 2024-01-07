"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTechniques = void 0;
function isValidTechnique(obj) {
    return typeof obj.techniqueId === 'number' &&
        typeof obj.name === 'string' &&
        typeof obj.videoSrc === 'string' &&
        typeof obj.imageSrc === 'string' &&
        typeof obj.description === 'string' &&
        typeof obj.globalNotes === 'string';
}
;
function validateTechniques(obj) {
    if (Array.isArray(obj) && obj.every(isValidTechnique)) {
        return obj;
    }
    else {
        throw new Error("Invalid global technique data");
    }
}
exports.validateTechniques = validateTechniques;
;
