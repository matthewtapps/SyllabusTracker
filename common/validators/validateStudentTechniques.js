"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateStudentTechniques = void 0;
var TechniqueStatus_1 = require("../types/enums/TechniqueStatus");
function isValidTechnique(obj) {
    return typeof obj.userId === 'number' &&
        typeof obj.techniqueId === 'number' &&
        Object.values(TechniqueStatus_1.TechniqueStatus).includes(obj.status) &&
        typeof obj.studentNotes === 'string' &&
        typeof obj.coachNotes === 'string';
}
;
function validateStudentTechniques(obj) {
    if (Array.isArray(obj) && obj.every(isValidTechnique)) {
        return obj;
    }
    else {
        var invalidItem = obj.find(function (item) { return !isValidTechnique(item); });
        throw new Error("Invalid student technique data: ".concat(JSON.stringify(invalidItem, null, 2)));
    }
}
exports.validateStudentTechniques = validateStudentTechniques;
;
