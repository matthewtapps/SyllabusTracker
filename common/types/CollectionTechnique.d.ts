import { Technique } from "./Technique";
import { Collection } from "./Collection";
export interface CollectionTechnique {
    id: string;
    order: number;
    collection: Collection;
    technique: Technique;
}
