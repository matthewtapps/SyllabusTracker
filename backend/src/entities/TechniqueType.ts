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

    @CreateDateColumn()
    lastUpdated: Date;

    @UpdateDateColumn()
    created: Date;
}
