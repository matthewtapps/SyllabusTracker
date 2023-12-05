import { Entity, PrimaryGeneratedColumn, Column, Generated } from "typeorm"
import { User as UserInterface, Role, Rank, Belt, Stripes } from 'common'

class EmbeddableRank {
    @Column()
    belt: Belt;

    @Column()
    stripes: Stripes;
}

@Entity()
export class User implements UserInterface {

    @PrimaryGeneratedColumn('uuid')
    @Generated('uuid')
    userId: string;

    @Column()
    role: Role;

    @Column()
    username: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    dateOfBirth: Date;

    @Column()
    email: string;
    
    @Column()
    mobile: string;

    @Column(() => EmbeddableRank)
    rank: Rank;
}
