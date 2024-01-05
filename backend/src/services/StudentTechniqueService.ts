import { TechniqueStatus } from 'common';
import { AppDataSource } from '../data-source';
import { StudentTechnique } from "../entities/StudentTechnique";
import { Technique } from "../entities/Technique";

export class StudentTechniqueService {
    async addStudentTechniques(techniques: Technique[], status: TechniqueStatus, studentId: string): Promise<StudentTechnique[]> {
        const studentTechniqueRepository = AppDataSource.getRepository(StudentTechnique);
        const newStudentTechniques = techniques.map(technique => {
            const studentTechnique = new StudentTechnique();
            studentTechnique.userId = studentId;
            studentTechnique.technique = technique;
            studentTechnique.status = status;
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

        return studentTechniqueRepository.findOne({ where: { studentTechniqueId: studentTechnique.studentTechniqueId } });
    }

    async fetchStudentTechniques(userId: string): Promise<{ status: number, res: StudentTechnique[] | { message: string } }> {
        const studentTechniqueRepository = AppDataSource.getRepository(StudentTechnique);
        const responseData = await studentTechniqueRepository.find({
            where: { userId },
            relations: ["technique", "technique.position", "technique.type", "technique.openGuard"]
        });

        if (responseData.length === 0) {
            return { status: 204, res: { message: 'No techniques found for given student Id' } };
        }

        return { status: 200, res: responseData };
    }

    async fetchAllStudentTechniques(): Promise<StudentTechnique[]> {
        const studentTechniqueRepository = AppDataSource.getRepository(StudentTechnique);
        const responseData = await studentTechniqueRepository.find({
            relations: ["technique", "technique.postion", "technique.type", "technique.openGuard"]
        })
        return responseData
    }

    async deleteStudentTechnique(data: { studentTechniqueId: string }) {
        const studentTechniqueRepository = AppDataSource.getRepository(StudentTechnique);

        console.log("Deleting student technique with ID:", data.studentTechniqueId);

        try {
            const studentTechnique = await studentTechniqueRepository.findOneBy({ studentTechniqueId: data.studentTechniqueId });

            if (!studentTechnique) {
                console.log("Failed to find studentTechnique when deleting");
            } else {
                await studentTechniqueRepository.createQueryBuilder()
                    .delete()
                    .from(StudentTechnique)
                    .where("studentTechniqueId = :studentTechniqueId", { studentTechniqueId: data.studentTechniqueId })
                    .execute();
            }
        } catch (error) {
            console.error("Error deleting student technique:", error);
        }
    }
};
