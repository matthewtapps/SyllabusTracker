import { Entity, PrimaryGeneratedColumn, Column, Generated, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class OpenGuard {
    @PrimaryGeneratedColumn('uuid')
    @Generated('uuid')
    openGuardId: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @UpdateDateColumn()
    lastUpdated: Date;

    @CreateDateColumn()
    created: Date;
}
