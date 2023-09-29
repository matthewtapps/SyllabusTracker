import fs from 'fs';
import { Technique } from './types/Technique';
import { validateTechniques } from './validators/isValidTechnique';
import { StudentTechnique } from './types/StudentTechnique';
import { InstanceTechnique } from './types/InstanceTechnique';
import { stringToTechniqueStatus } from './types/enums/TechniqueStatus';
import { validateStudentTechniques } from './validators/isValidStudentTechnique';

let techniquesPath = "data/techniques.json";
let studentTechniquesPath = "data/studentTechniques.json";

const userId = 1;

const techniques: Technique[] = validateTechniques(JSON.parse(fs.readFileSync(techniquesPath, 'utf8'))) as Technique[]

const rawStudentTechniques: StudentTechnique[] = JSON.parse(fs.readFileSync(studentTechniquesPath, 'utf8'));
rawStudentTechniques.forEach(technique => {
    technique.status = stringToTechniqueStatus(technique.status);
});
const studentTechniques: StudentTechnique[] = validateStudentTechniques(rawStudentTechniques) as StudentTechnique[]

const instanceTechniques: InstanceTechnique[] = studentTechniques
    .filter(studentTechnique => studentTechnique.userId === userId)
    .map(studentTechnique => {
        const technique = techniques.find(technique => technique.techniqueId === studentTechnique.techniqueId);
        return {
            ...technique,
            status: studentTechnique.status,
            studentNotes: studentTechnique.studentNotes,
            coachNotes: studentTechnique.coachNotes
        } as InstanceTechnique;
    });

console.log(instanceTechniques)