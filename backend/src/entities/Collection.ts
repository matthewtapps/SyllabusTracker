import { Gi, Hierarchy, Collection as CollectionInterface} from "common";
import { Entity, PrimaryGeneratedColumn, Column, Generated, OneToMany, ManyToOne, JoinTable} from "typeorm";
import { CollectionTechnique } from "./CollectionTechnique";
import { Position } from "./Position";
import { TechniqueType } from "./TechniqueType";
import { OpenGuard } from "./OpenGuard";

@Entity()
export class Collection implements CollectionInterface {
    @PrimaryGeneratedColumn('uuid')
    @Generated('uuid')
    collectionId: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    globalNotes: string;

    @Column({nullable: true})
    gi?: Gi;

    @Column({nullable: true})
    hierarchy?: Hierarchy;

    @OneToMany(() => CollectionTechnique, ct => ct.collection)
    collectionTechniques: CollectionTechnique[];

    @ManyToOne(type => Position, position => position.title, {nullable: true})
    @JoinTable()
    position?: Position;

    @ManyToOne(type => TechniqueType, type => type.title, {nullable: true})
    @JoinTable()
    type?: TechniqueType;
    
    @ManyToOne(type => OpenGuard, openGuard => openGuard.title, {nullable: true})
    @JoinTable()
    openGuard?: OpenGuard;
}
