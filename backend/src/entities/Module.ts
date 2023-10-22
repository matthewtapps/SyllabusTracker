import { Gi, Module as ModuleInterface} from "common";
import { Entity, PrimaryGeneratedColumn, Column, Generated, ManyToMany, JoinTable, ManyToOne } from "typeorm";
import { Technique } from "./Technique";
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
    gi: Gi;

    @ManyToMany(type => Technique, technique => technique.techniqueId)
    @JoinTable()
    techniques: Technique[];

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
