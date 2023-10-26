import { Gi, Hierarchy, Module as ModuleInterface} from "common";
import { Entity, PrimaryGeneratedColumn, Column, Generated, OneToMany, ManyToOne, JoinTable} from "typeorm";
import { ModuleTechnique } from "./ModuleTechnique";
import { Position } from "./Position";
import { TechniqueType } from "./TechniqueType";
import { OpenGuard } from "./OpenGuard";

@Entity()
export class Module implements ModuleInterface {
    @PrimaryGeneratedColumn('uuid')
    @Generated('uuid')
    moduleId: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    globalNotes: string;

    @Column()
    gi: Gi;

    @Column()
    hierarchy: Hierarchy;

    @OneToMany(() => ModuleTechnique, mt => mt.module)
    moduleTechniques: ModuleTechnique[];

    @ManyToOne(type => Position, position => position.positionId)
    @JoinTable()
    position: Position;

    @ManyToOne(type => TechniqueType, type => type.typeId)
    @JoinTable()
    type: TechniqueType;
    
    @ManyToOne(type => OpenGuard, openGuard => openGuard.openGuardId)
    @JoinTable()
    openGuard: OpenGuard;
}
