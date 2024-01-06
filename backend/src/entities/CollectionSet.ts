import { CollectionSet as CollectionSetInterface} from "common";
import { Entity, PrimaryGeneratedColumn, Column, Generated, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { CollectionTechnique } from "./CollectionTechnique";
import { Technique } from "./Technique";
import { Collection } from "./Collection";

@Entity()
export class CollectionSet implements CollectionSetInterface {
    @PrimaryGeneratedColumn('uuid')
    @Generated('uuid')
    collectionSetId: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @OneToMany(() => Collection, col => col.collectionSets, {nullable: true})
    collections: Collection[];

    @UpdateDateColumn()
    lastUpdated: Date;

    @CreateDateColumn()
    created: Date;
}
