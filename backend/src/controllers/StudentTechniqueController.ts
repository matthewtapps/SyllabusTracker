import { Request, Response } from "express";
import { StudentTechniqueService } from "../services/StudentTechniqueService";
import { StudentTechnique } from "common";

export class StudentTechniqueController {
    static async postStudentTechniques(req: Request, res: Response) {
        const studentTechniqueService = new StudentTechniqueService();
        try {
            const studentId = req.params.userId
            const { techniques, status } = req.body;
            const newStudentTechniques = await studentTechniqueService.postStudentTechniques(techniques, status, studentId);
            res.status(201).json(newStudentTechniques);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async postStudentTechnique(req: Request, res: Response) {
        const studentTechniqueService = new StudentTechniqueService();
        try {
            const studentId = req.params.userId
            const { status, technique } = req.body;
            const newStudentTechnique = await studentTechniqueService.postStudentTechnique(studentId, status, technique);
            res.status(200).json(newStudentTechnique);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async updateStudentTechnique(req: Request, res: Response) {
        const studentTechniqueService = new StudentTechniqueService();
        try {
            const updatedData = req.body;
            const updatedStudentTechnique = await studentTechniqueService.updateStudentTechnique(updatedData);
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
        const studentTechniqueId = req.params.techniqueId
        try {
            await studentTechniqueService.deleteStudentTechnique(studentTechniqueId)
            res.status(200).json({ message: 'Student technique deleted successfully' });
        } catch (error) {
            res.status(400).json({error: error.message})
        }
    }
}
