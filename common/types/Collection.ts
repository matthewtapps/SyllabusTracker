import { CollectionTechnique } from "./Types";
import { Gi, Hierarchy, Technique } from "./Types";

export interface Collection {
    collectionId: string;
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
