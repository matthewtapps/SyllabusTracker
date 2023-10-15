import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, Generated } from "typeorm";
import { Technique } from "./Technique";
import { StudentTechnique as StudentTechniqueInterface } from "common";
import { User } from "./User";
import { TechniqueStatus } from "common";

@Entity()
export class StudentTechnique implements StudentTechniqueInterface {
    @PrimaryGeneratedColumn('uuid')
    @Generated('uuid')
    studentTechniqueId: string;

    @ManyToOne(() => User)
    _userId: User;

    get userId(): string {
        return this._userId.userId
    }

    @ManyToOne(() => Technique)
    _techniqueId: Technique;

    get techniqueId(): string {
        return this._techniqueId.techniqueId
    }

    @Column()
    status: TechniqueStatus;

    @Column()
    studentNotes: string;

    @Column()
    coachNotes: string;
}
