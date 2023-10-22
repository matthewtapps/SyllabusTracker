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
    type: DTO; // Technique Type relational database object
    position: DTO; // Technqiue Position relational database object
    openGuard?: DTO; // Technique OpenGuard relational database object
                              // May be null if position is not an open guard
}

interface DTO {
    title: string;
    description: string;
}
