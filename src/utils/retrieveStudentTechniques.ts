import fs from 'fs';
import { StudentTechnique } from "../types/StudentTechnique";
import { stringToTechniqueStatus } from "../types/enums/TechniqueStatus";
import { validateStudentTechniques } from '../validators/validateStudentTechniques';
import { filterStudentTechniques } from './filterStudentTechniques';

let studentTechniquesPath = "./data/studentTechniques.json";

export function retrieveStudentTechniques(
    userId: number
): StudentTechnique[] {
    const rawStudentTechniques: StudentTechnique[] = JSON
    .parse(fs.readFileSync(studentTechniquesPath, 'utf8')).studentTechniques;
    
    rawStudentTechniques.forEach(technique => {
        technique.status = stringToTechniqueStatus(technique.status);
    })

    const filteredTechniques: StudentTechnique[] = filterStudentTechniques(rawStudentTechniques, userId)

    return validateStudentTechniques(filteredTechniques);
};
