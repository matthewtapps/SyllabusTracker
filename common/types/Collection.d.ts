import { CollectionTechnique } from "./Types";
import { Gi, Hierarchy } from "./Types";
export interface Collection {
    collectionId: string;
    title: string;
    description: string;
    globalNotes?: string;
    gi?: Gi;
    collectionTechniques: CollectionTechnique[];
    hierarchy?: Hierarchy;
    type?: DTO;
    position?: DTO;
    openGuard?: DTO;
}
interface DTO {
    title: string;
    description: string;
}
export {};
