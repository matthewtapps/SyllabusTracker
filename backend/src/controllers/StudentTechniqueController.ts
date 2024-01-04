import { Request, Response } from "express";
import { StudentTechniqueService } from "../services/StudentTechniqueService";
import { StudentTechnique } from "common";

export class StudentTechniqueController {
    static async addStudentTechniques(req: Request, res: Response) {
        const studentTechniqueService = new StudentTechniqueService();
        try {
            const { techniques, studentId } = req.body;
            const newStudentTechniques = await studentTechniqueService.addStudentTechniques(techniques, studentId);
            res.status(201).json(newStudentTechniques);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async updateStudentTechnique(req: Request, res: Response) {
        const studentTechniqueService = new StudentTechniqueService();
        try {
            const { studentId, techniqueId, updatedData } = req.body;
            const updatedStudentTechnique = await studentTechniqueService.updateStudentTechnique(studentId, techniqueId, updatedData);
            res.status(200).json(updatedStudentTechnique);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async fetchStudentTechniques(req: Request, res: Response) {
        const studentTechniqueService = new StudentTechniqueService();
        const userId = req.params.userId
        try {
            const databaseReponse: {status: number, res: StudentTechnique[] | {message: string}} = await studentTechniqueService.fetchStudentTechniques(userId);
            res.status(databaseReponse.status).json(databaseReponse.res)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async fetchAllStudentTechniques(req: Request, res: Response) {
        const studentTechniqueService = new StudentTechniqueService();
        try {
            const studentTechniques = await studentTechniqueService.fetchAllStudentTechniques();
            res.status(200).json(studentTechniques);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async deleteStudentTechnique(req: Request, res: Response) {
        const studentTechniqueService = new StudentTechniqueService();
        try {
            await studentTechniqueService.deleteStudentTechnique(req.body)
            res.status(200).json({ message: 'Student technique deleted successfully' });
        } catch (error) {
            res.status(400).json({error: error.message})
        }
    }
}
