import { Collection, Technique } from "./Types";
import { Gi } from "./Types";

export interface CollectionSet {
    collectionSetId: string;
    title: string;
    description: string;
    techniques: Technique[] | null;
    lastUpdated: Date;
    created: Date;
}
