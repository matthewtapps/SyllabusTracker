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
            return studentTechnique;
        });

        return await studentTechniqueRepository.save(newStudentTechniques);
    }

    async updateOrPostStudentTechnique(studentId: string, techniqueId: string, updatedData: Partial<StudentTechnique>): Promise<StudentTechnique> {
        const studentTechniqueRepository = AppDataSource.getRepository(StudentTechnique);
        const selectedStudentTechnique = await studentTechniqueRepository.findOne({
            where: {
                userId: studentId,
                technique: { techniqueId: techniqueId }
            },
            relations: ["technique"]
        });

        try {

            if (selectedStudentTechnique) {

                await studentTechniqueRepository.update(selectedStudentTechnique.studentTechniqueId, {
                    ...updatedData,
                    lastUpdated: new Date()
                });

                return studentTechniqueRepository.findOne({ where: { studentTechniqueId: selectedStudentTechnique.studentTechniqueId } });

            } else {
                const newStudentTechnique = new StudentTechnique();
                newStudentTechnique.coachNotes = updatedData.coachNotes
                newStudentTechnique.status = updatedData.status
                newStudentTechnique.studentNotes = updatedData.studentNotes
                newStudentTechnique.technique = updatedData.technique
                newStudentTechnique.userId = studentId

                return studentTechniqueRepository.save(newStudentTechnique)
            }

        } catch (error) { console.error(`Error updating or creating student technique: ${error}`) }
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

    async deleteStudentTechnique(studentTechniqueId: string) {
        const studentTechniqueRepository = AppDataSource.getRepository(StudentTechnique);

        console.log("Deleting student technique with ID:", studentTechniqueId);

        try {
            const studentTechnique = await studentTechniqueRepository.findOneBy({ studentTechniqueId: studentTechniqueId });

            if (!studentTechnique) {
                console.log("Failed to find studentTechnique when deleting");
            } else {
                await studentTechniqueRepository.createQueryBuilder()
                    .delete()
                    .from(StudentTechnique)
                    .where("studentTechniqueId = :studentTechniqueId", { studentTechniqueId: studentTechniqueId })
                    .execute();
            }
        } catch (error) {
            console.error("Error deleting student technique:", error);
        }
    }
};
