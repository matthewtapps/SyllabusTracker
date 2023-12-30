import { AppDataSource } from '../data-source';
import { StudentTechnique } from "../entities/StudentTechnique";
import { Technique } from "../entities/Technique";
import { TechniqueStatus } from 'common';

export class StudentTechniqueService {
    async addStudentTechniques(techniques: Technique[], studentId: string): Promise<StudentTechnique[]> {
        const studentTechniqueRepository = AppDataSource.getRepository(StudentTechnique);
        const newStudentTechniques = techniques.map(technique => {
            const studentTechnique = new StudentTechnique();
            studentTechnique.userId = studentId;
            studentTechnique.technique = technique;
            studentTechnique.status = TechniqueStatus.NotYetStarted;
            studentTechnique.studentNotes = '';
            studentTechnique.coachNotes = '';
            studentTechnique.lastUpdated = new Date();
            studentTechnique.created = new Date();
            return studentTechnique;
        });

        return await studentTechniqueRepository.save(newStudentTechniques);
    }

    async updateStudentTechnique(studentId: string, techniqueId: string, updatedData: Partial<StudentTechnique>): Promise<StudentTechnique> {
        const studentTechniqueRepository = AppDataSource.getRepository(StudentTechnique);
        const studentTechnique = await studentTechniqueRepository.findOne({
            where: {
                userId: studentId,
                technique: { techniqueId: techniqueId }
            },
            relations: ["technique"]
        });

        if (!studentTechnique) {
            throw new Error('Student technique not found');
        }

        await studentTechniqueRepository.update(studentTechnique.studentTechniqueId, {
            ...updatedData,
            lastUpdated: new Date()
        });

        return studentTechniqueRepository.findOne({where: {studentTechniqueId: studentTechnique.studentTechniqueId}});
    }

    async getStudentTechniques(userId: string): Promise<StudentTechnique[]> {
        const studentTechniqueRepository = AppDataSource.getRepository(StudentTechnique);
        return studentTechniqueRepository.find({ where: { userId } });
    }
};
