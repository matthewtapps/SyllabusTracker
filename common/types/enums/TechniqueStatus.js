"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringToTechniqueStatus = exports.TechniqueStatus = void 0;
var TechniqueStatus;
(function (TechniqueStatus) {
    TechniqueStatus["Passed"] = "Passed";
    TechniqueStatus["Started"] = "Started";
    TechniqueStatus["NotYetStarted"] = "Not Yet Started";
})(TechniqueStatus || (exports.TechniqueStatus = TechniqueStatus = {}));
function stringToTechniqueStatus(value) {
    if (Object.values(TechniqueStatus).includes(value)) {
        return value;
    }
    throw new Error("Invalid Technique Status Value: ".concat(value));
}
exports.stringToTechniqueStatus = stringToTechniqueStatus;
