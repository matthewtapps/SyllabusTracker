import { StudentService } from "../services/StudentService"
import { Request, Response } from "express";

export class StudentController {
    static async fetchStudents(req: Request, res: Response) {
        const studentService = new StudentService();
        try {
            const students = await studentService.fetchStudents();
            res.json(students);
        } catch (error) {
            console.log(error)
            res.status(400).json({ error: error });
        }
    }
}
