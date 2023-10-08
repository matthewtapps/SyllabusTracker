import * as fs from 'fs';
import { StudentTechnique } from "../../shared/types/StudentTechnique";
import { stringToTechniqueStatus } from "../../shared/types/enums/TechniqueStatus";
import { validateStudentTechniques } from '../../shared/validators/validateStudentTechniques';
import { filterStudentTechniques } from './filterStudentTechniques';

let studentTechniquesPath = "./dummy_data/studentTechniques.json";

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
