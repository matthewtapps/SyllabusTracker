import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import { Rank } from '../../types/Rank'

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    age: number

    @Column()
    rank: Rank

    @Column()
    email: string
}
