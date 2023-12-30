import { Hierarchy } from "./Types";
import { Gi } from "./enums/Gi";
export interface Technique {
    techniqueId: string;
    title: string;
    videoSrc: string | null;
    description: string;
    globalNotes: string | null;
    gi: Gi;
    hierarchy: Hierarchy;
    type: DTO;
    position: DTO;
    openGuard: DTO | null;
    lastUpdated: Date;
    created: Date;
}
interface DTO {
    title: string;
    description: string;
}
export {};
