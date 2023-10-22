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
    type: DTO;
    position: DTO;
    openGuard?: DTO;
}
interface DTO {
    title: string;
    description: string;
}
export {};
