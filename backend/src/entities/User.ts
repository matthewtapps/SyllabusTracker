import { Entity, PrimaryGeneratedColumn, Column, Generated } from "typeorm"
import { User as UserInterface, Role } from 'common'

@Entity()
export class User implements UserInterface {

    @PrimaryGeneratedColumn('uuid')
    @Generated('uuid')
    userId: string;

    @Column({
        type: "enum",
        enum: Role
    })
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

}
