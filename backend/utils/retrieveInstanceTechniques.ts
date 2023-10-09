import { StudentTechnique, Technique, InstanceTechnique } from "common";

export function retrieveInstanceTechniques(
    globalTechniques: Technique[], 
    studentTechniques: StudentTechnique[],
    ): InstanceTechnique[] {
            return studentTechniques
            .map(studentTechnique => {
                const technique = globalTechniques.find(technique => technique.techniqueId === studentTechnique.techniqueId);
                return {
                    ...technique,
                    status: studentTechnique.status,
                    studentNotes: studentTechnique.studentNotes,
                    coachNotes: studentTechnique.coachNotes
                } as InstanceTechnique;
            });
        }
