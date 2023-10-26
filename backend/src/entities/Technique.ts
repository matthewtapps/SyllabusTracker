import { Hierarchy, Technique as TechniqueInterface, Gi } from "common";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Generated, OneToMany } from "typeorm";
import { TechniqueType } from "./TechniqueType";
import { Position } from "./Position";
import { OpenGuard } from "./OpenGuard";
import { ModuleTechnique } from "./ModuleTechnique";

@Entity()
export class Technique implements TechniqueInterface {
    @PrimaryGeneratedColumn('uuid')
    @Generated('uuid')
    techniqueId: string;

    @Column()
    title: string;

    @Column()
    videoSrc: string;

    @Column()
    description: string;

    @Column()
    globalNotes: string;

    @Column()
    gi: Gi;

    @Column()
    hierarchy: Hierarchy;

    @ManyToOne(() => TechniqueType)
    type: TechniqueType;

    @ManyToOne(() => Position)
    position: Position;

    @ManyToOne(() => OpenGuard)
    openGuard: OpenGuard;

    @OneToMany(() => ModuleTechnique, mt => mt.technique)
    moduleTechniques: ModuleTechnique[]
}
