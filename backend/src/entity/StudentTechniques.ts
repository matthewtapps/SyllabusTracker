import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import { TechniqueStatus } from "../../types/enums/TechniqueStatus"

@Entity()
export class StudentTechnique {

    @PrimaryGeneratedColumn()
    userId: number

    @Column()
    techniqueId: number

    @Column()
    status: TechniqueStatus

    @Column()
    studentNotes: string

    @Column()
    coachNotes: string
}
