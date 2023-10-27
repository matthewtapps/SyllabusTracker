import { CollectionTechnique } from "./Types";
import { Gi, Hierarchy } from "./Types";
export interface Collection {
    moduleId: string;
    title: string;
    description: string;
    gi?: Gi;
    collectionTechniques: CollectionTechnique[];
    hierarchy?: Hierarchy;
    type?: DTO;
    position?: DTO;
    openGuard?: DTO;
}
interface DTO {
    title: string;
}
export {};
