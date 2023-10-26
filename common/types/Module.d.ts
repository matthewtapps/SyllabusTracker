import { Gi, Hierarchy, Technique } from "./Types";
export interface Module {
    moduleId: string;
    title: string;
    description: string;
    gi: Gi;
    moduleTechniques: ModuleTechniqueDTO[];
    hierarchy: Hierarchy;
    type: DTO;
    position: DTO;
    openGuard: DTO;
}
interface DTO {
    title: string;
}
interface ModuleTechniqueDTO {
    index: number;
    technique: Technique;
}
export {};
