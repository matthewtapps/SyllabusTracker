import { Hierarchy } from "./Types";
import { Gi } from "./enums/Gi";

export interface Technique {
    techniqueId: string;
    title: string;
    videoSrc: string;
    description: string;
    globalNotes: string;
    gi: Gi;
    hierarchy: Hierarchy;
    type: string; // Technique Type relational database object
    position: string; // Technqiue Position relational database object
    openGuard: string | null; // Technique OpenGuard relational database object
                              // May be null if position is not an open guard
}
