import { Entity, PrimaryGeneratedColumn, Generated, Column, ManyToOne, JoinTable } from "typeorm";
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
}
