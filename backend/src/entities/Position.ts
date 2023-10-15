import { Entity, PrimaryGeneratedColumn, Column, Generated } from "typeorm";

@Entity()
export class Position {
    @PrimaryGeneratedColumn('uuid')
    @Generated('uuid')
    positionId: string;

    @Column()
    title: string;

    @Column()
    description: string;
}
