import { Technique } from "./Technique";
import { Collection } from "./Collection";

export interface CollectionTechnique {
    collectionTechniqueId: string;
    order: number;
    collection: Collection;
    technique: Technique;
}
