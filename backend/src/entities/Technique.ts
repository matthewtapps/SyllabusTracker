import { Hierarchy, Technique as TechniqueInterface, Gi } from "common";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Generated } from "typeorm";
import { TechniqueType } from "./TechniqueType";
import { Position } from "./Position";
import { OpenGuard } from "./OpenGuard";

@Entity()
export class Technique implements TechniqueInterface {
    @PrimaryGeneratedColumn('uuid')
    @Generated('uuid')
    techniqueId: string;

    @Column()
    title: string;

    @Column()
    videoSrc: string;

    @Column()
    description: string;

    @Column()
    globalNotes: string;

    @Column()
    gi: Gi;

    @Column()
    hierarchy: Hierarchy;

    @ManyToOne(() => TechniqueType)
    _type: TechniqueType;

    get type(): string {
        return this._type.title;
    }

    set type(title: string) {
        const type = new TechniqueType();
        type.title = title;
        this._type = type;
    }

    @ManyToOne(() => Position)
    _position: Position;

    get position(): string {
        return this._position.title;
    }

    set position(title: string) {
        const position = new Position();
        position.title = title;
        this._position = position;
    }

    @ManyToOne(() => OpenGuard, { nullable: true})
    _openGuard: OpenGuard | null;

    get openGuard(): string | null {
        return this._openGuard ? this._openGuard.title : null;
    }

    set openGuard(title: string) {
        const openGuard = new OpenGuard();
        openGuard.title = title;
        this._openGuard = openGuard;
    }
}
