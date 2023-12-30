import { Technique } from "./Types";
export interface CollectionSet {
    collectionSetId: string;
    title: string;
    description: string;
    techniques: Technique[] | null;
    lastUpdated: Date;
    created: Date;
}
