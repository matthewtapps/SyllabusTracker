import { Entity, PrimaryGeneratedColumn, Generated, Column, ManyToOne } from "typeorm";
import { Technique } from "./Technique";
import { Module } from "./Module";


@Entity()
export class ModuleTechnique implements ModuleTechnique{
    @PrimaryGeneratedColumn('uuid')
    @Generated('uuid')
    id: string;

    @Column()
    order: number;

    @ManyToOne(() => Module, module => module.moduleTechniques)
    module: Module;

    @ManyToOne(() => Technique, technique => technique.moduleTechniques)
    technique: Technique;
}
