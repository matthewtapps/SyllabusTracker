import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Generated } from "typeorm";
import { Technique } from "./Technique";
import { StudentTechnique as StudentTechniqueInterface } from "common";
import { TechniqueStatus } from "common";

@Entity()
export class StudentTechnique implements StudentTechniqueInterface {
    @PrimaryGeneratedColumn('uuid')
    @Generated('uuid')
    studentTechniqueId: string;

    @Column()
    userId: string;

    @ManyToOne(() => Technique)
    technique: Technique;

    @Column()
    status: TechniqueStatus;

    @Column()
    studentNotes: string;

    @Column()
    coachNotes: string;
}
