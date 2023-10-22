import { Technique } from "./Technique";
import { Gi } from "./Types";

export interface Module {
    moduleId: string;
    title: string;
    description: string;
    gi: Gi;
    techniques: Technique[];
    type: DTO;
    position: DTO;
    openGuard: DTO;
}

interface DTO {
    title: string;
}
