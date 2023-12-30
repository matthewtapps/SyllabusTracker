import { CollectionSet as CollectionSetInterface} from "common";
import { Entity, PrimaryGeneratedColumn, Column, Generated, OneToMany } from "typeorm";
import { CollectionTechnique } from "./CollectionTechnique";
import { Technique } from "./Technique";

@Entity()
export class CollectionSet implements CollectionSetInterface {
    @PrimaryGeneratedColumn('uuid')
    @Generated('uuid')
    collectionSetId: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @OneToMany(() => CollectionTechnique, ct => ct.collection, {nullable: true})
    techniques: Technique[];
}
