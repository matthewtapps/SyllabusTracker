import { Collection } from "./Types";

export interface CollectionSet {
    collectionSetId: string;
    title: string;
    description: string;
    collections: Collection[] | null;
    lastUpdated: Date;
    created: Date;
}
