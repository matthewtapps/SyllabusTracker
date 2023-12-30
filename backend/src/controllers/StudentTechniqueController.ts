import { Request, Response } from "express";
import { StudentTechniqueService } from "../services/StudentTechniqueService";

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

    static async getStudentTechniques(req: Request, res: Response) {
        const studentTechniqueService = new StudentTechniqueService();
        try {
            const { userId } = req.params;
            const studentTechniques = await studentTechniqueService.getStudentTechniques(userId);
            res.status(200).json(studentTechniques);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
