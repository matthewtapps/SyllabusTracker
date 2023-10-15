import { Entity, PrimaryGeneratedColumn, Column, Generated } from "typeorm";

@Entity()
export class TechniqueType {
    @PrimaryGeneratedColumn('uuid')
    @Generated('uuid')
    typeId: string;
    
    @Column()
    title: string;

    @Column()
    description: string;
}
