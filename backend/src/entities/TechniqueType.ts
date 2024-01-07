import { Entity, PrimaryGeneratedColumn, Column, Generated, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class TechniqueType {
    @PrimaryGeneratedColumn('uuid')
    @Generated('uuid')
    typeId: string;
    
    @Column()
    title: string;

    @Column()
    description: string;

    @UpdateDateColumn()
    lastUpdated: Date;

    @CreateDateColumn()
    created: Date;
}
