import { Entity, PrimaryGeneratedColumn, Column, Generated } from "typeorm";

@Entity()
export class OpenGuard {
    @PrimaryGeneratedColumn('uuid')
    @Generated('uuid')
    openGuardId: string;

    @Column()
    title: string;

    @Column()
    description: string;
}
