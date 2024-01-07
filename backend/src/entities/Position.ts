import { Entity, PrimaryGeneratedColumn, Column, Generated, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Position {
    @PrimaryGeneratedColumn('uuid')
    @Generated('uuid')
    positionId: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @UpdateDateColumn()
    lastUpdated: Date;

    @CreateDateColumn()
    created: Date;
}
