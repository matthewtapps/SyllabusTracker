import { CollectionTechnique } from "./Types";
import { Gi, Hierarchy } from "./Types";

export interface Collection {
    collectionId: string;
    title: string;
    description: string;
    globalNotes?: string | null;
    gi?: Gi | null;
    collectionTechniques: CollectionTechnique[] | null;
    hierarchy?: Hierarchy | null;
    type?: DTO | null;
    position?: DTO | null;
    openGuard?: DTO | null;
    lastUpdated: Date;
    created: Date;
}

interface DTO {
    title: string;
    description: string;
}
