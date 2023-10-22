import { Technique } from "./Technique";
export interface Module {
    moduleId: string;
    title: string;
    description: string;
    techniques: Technique[];
}
