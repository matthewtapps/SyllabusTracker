import { Hierarchy } from "./Types";
import { Gi } from "./enums/Gi";

export interface Technique {
    techniqueId: string;
    title: string;
    videos: {title: string, hyperlink: string}[] | null;
    description: string;
    globalNotes: string | null;
    gi: Gi;
    hierarchy: Hierarchy;
    type: DTO; // Technique Type relational database object
    position: DTO; // Technqiue Position relational database object
    openGuard: DTO | null; // Technique OpenGuard relational database object
                              // May be null if position is not an open guard
    lastUpdated: Date;
    created: Date;
}

interface DTO {
    title: string;
    description: string;
}
