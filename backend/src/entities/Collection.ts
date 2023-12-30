import { Gi, Hierarchy, Collection as CollectionInterface} from "common";
import { Entity, PrimaryGeneratedColumn, Column, Generated, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn} from "typeorm";
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

    @Column({nullable: true})
    globalNotes: string;

    @Column({nullable: true})
    gi: Gi;

    @Column({nullable: true})
    hierarchy: Hierarchy;

    @OneToMany(() => CollectionTechnique, ct => ct.collection, {nullable: true})
    collectionTechniques: CollectionTechnique[];

    @ManyToOne(type => Position, position => position.title, {nullable: true})
    position?: Position;

    @ManyToOne(type => TechniqueType, type => type.title, {nullable: true})
    type?: TechniqueType;
    
    @ManyToOne(type => OpenGuard, openGuard => openGuard.title, {nullable: true})
    openGuard?: OpenGuard;

    @CreateDateColumn()
    lastUpdated: Date;

    @UpdateDateColumn()
    created: Date;
}
