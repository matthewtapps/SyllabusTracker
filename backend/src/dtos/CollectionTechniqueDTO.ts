import { Technique, Collection } from "common";

export default class CollectionTechniqueDTO {
    techniques: DTO[]
    collection: Collection;
} 

class DTO {
    index: number;
    technique: Technique;
}
