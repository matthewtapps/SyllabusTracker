import { StudentTechnique } from "../types/StudentTechnique";
import { Technique } from "../types/Technique";
import { InstanceTechnique } from "../types/InstanceTechnique";

export function retrieveInstanceTechniques(
    globalTechniques: Technique[], 
    studentTechniques: StudentTechnique[],
    userId: number): InstanceTechnique[] {
        if (Array.isArray(studentTechniques)) {
            return studentTechniques
            .filter(studentTechnique => studentTechnique.userId === userId)
            .map(studentTechnique => {
                const technique = globalTechniques.find(technique => technique.techniqueId === studentTechnique.techniqueId);
                return {
                    ...technique,
                    status: studentTechnique.status,
                    studentNotes: studentTechnique.studentNotes,
                    coachNotes: studentTechnique.coachNotes
                } as InstanceTechnique;
            });
        } else {
            throw new Error(`Invalid instance techniques from combination of student & global techniques`)
        }
}
