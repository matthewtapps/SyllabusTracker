import { StudentTechnique } from "common"

export function filterStudentTechniques(
    studentTechniques: StudentTechnique[],
    userId: string
    ): StudentTechnique[] {
        return studentTechniques.filter(technique => technique.userId = userId)
    }
