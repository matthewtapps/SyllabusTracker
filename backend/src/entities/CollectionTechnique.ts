import { Entity, PrimaryGeneratedColumn, Generated, Column, ManyToOne, JoinTable, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Technique } from "./Technique";
import { Collection } from "./Collection";


@Entity()
export class CollectionTechnique implements CollectionTechnique{
    @PrimaryGeneratedColumn('uuid')
    @Generated('uuid')
    collectionTechniqueId: string;

    @Column()
    order: number;

    @ManyToOne(() => Collection, collection => collection.collectionTechniques)
    collection: Collection;

    @ManyToOne(() => Technique, technique => technique.collectionTechniques)
    technique: Technique;

    @UpdateDateColumn()
    lastUpdated: Date;

    @CreateDateColumn()
    created: Date;
}
