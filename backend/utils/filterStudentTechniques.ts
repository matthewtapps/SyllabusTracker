import { StudentTechnique } from "../../shared/types/StudentTechnique"

export function filterStudentTechniques(
    studentTechniques: StudentTechnique[],
    userId: number
    ): StudentTechnique[] {
        return studentTechniques.filter(technique => technique.userId = userId)
    }
