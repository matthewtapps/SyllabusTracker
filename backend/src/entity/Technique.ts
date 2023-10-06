import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Technique {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    position: string

    @Column()
    subposition: string

    @Column()
    hierarchy: string

    @Column()
    type: string

    @Column()
    subtype: string

    @Column()
    vidSrc: string

    @Column()
    description: string

    @Column()
    globalNotes: string
}
