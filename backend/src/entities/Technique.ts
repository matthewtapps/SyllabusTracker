import { Hierarchy, Technique as TechniqueInterface, Gi } from "common";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Generated, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { TechniqueType } from "./TechniqueType";
import { Position } from "./Position";
import { OpenGuard } from "./OpenGuard";
import { CollectionTechnique } from "./CollectionTechnique";

@Entity()
export class Technique implements TechniqueInterface {
    @PrimaryGeneratedColumn('uuid')
    @Generated('uuid')
    techniqueId: string;

    @Column()
    title: string;

    @Column({nullable: true, type: 'json'})
    videos: {title: string, hyperlink: string}[];

    @Column()
    description: string;

    @Column({nullable: true})
    globalNotes: string;

    @Column()
    gi: Gi;

    @Column()
    hierarchy: Hierarchy;

    @ManyToOne(() => TechniqueType)
    type: TechniqueType;

    @ManyToOne(() => Position)
    position: Position;

    @ManyToOne(() => OpenGuard, {nullable: true})
    openGuard: OpenGuard;

    @OneToMany(() => CollectionTechnique, ct => ct.technique, {nullable: true})
    collectionTechniques: CollectionTechnique[];

    @UpdateDateColumn()
    lastUpdated: Date;

    @CreateDateColumn()
    created: Date;
}
