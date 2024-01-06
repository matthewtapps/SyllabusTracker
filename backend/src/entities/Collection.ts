import { Gi, Hierarchy, Collection as CollectionInterface} from "common";
import { Entity, PrimaryGeneratedColumn, Column, Generated, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn, ManyToMany} from "typeorm";
import { CollectionTechnique } from "./CollectionTechnique";
import { Position } from "./Position";
import { TechniqueType } from "./TechniqueType";
import { OpenGuard } from "./OpenGuard";
import { CollectionSet } from "./CollectionSet";

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


    @ManyToOne(type => Position, position => position.title, {nullable: true})
    position?: Position;

    @ManyToOne(type => TechniqueType, type => type.title, {nullable: true})
    type?: TechniqueType;
    
    @ManyToOne(type => OpenGuard, openGuard => openGuard.title, {nullable: true})
    openGuard?: OpenGuard;

    @UpdateDateColumn()
    lastUpdated: Date;

    @CreateDateColumn()
    created: Date;

    @OneToMany(() => CollectionTechnique, ct => ct.collection, {nullable: true})
    collectionTechniques: CollectionTechnique[];

    @ManyToMany(() => CollectionSet, cs => cs.collections, {nullable: true})
    collectionSets: CollectionSet[]
}
