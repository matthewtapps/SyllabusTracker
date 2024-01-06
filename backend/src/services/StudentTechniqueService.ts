import { TechniqueStatus } from 'common';
import { AppDataSource } from '../data-source';
import { StudentTechnique } from "../entities/StudentTechnique";
import { Technique } from "../entities/Technique";

export class StudentTechniqueService {
    async postStudentTechniques(techniques: Technique[], status: TechniqueStatus, studentId: string): Promise<StudentTechnique[]> {
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

    async postStudentTechnique(studentId: string, status: TechniqueStatus, technique: Technique): Promise<StudentTechnique> {
        const studentTechniqueRepository = AppDataSource.getRepository(StudentTechnique);
        const studentTechnique = new StudentTechnique();
        studentTechnique.userId = studentId;
        studentTechnique.technique = technique;
        studentTechnique.status = status;

        return await studentTechniqueRepository.save(studentTechnique);
    }

    async updateStudentTechnique(updatedData: Partial<StudentTechnique>): Promise<StudentTechnique> {
        const studentTechniqueRepository = AppDataSource.getRepository(StudentTechnique);
        const selectedStudentTechnique = await studentTechniqueRepository.findOne({
            where: {
                studentTechniqueId: updatedData.studentTechniqueId
            },
            relations: ["technique"]
        });

        try {
            if (!selectedStudentTechnique) { throw new Error(`Student technique not found when updating`) }

            await studentTechniqueRepository.update(selectedStudentTechnique.studentTechniqueId, {
                ...updatedData
            });

            return studentTechniqueRepository.findOne({ where: { studentTechniqueId: selectedStudentTechnique.studentTechniqueId } });

        } catch (error) { console.error(`Error updating student technique: ${error}`) }
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
