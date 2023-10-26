import { Technique } from "./Technique";
import { Module } from "./Module";

export interface ModuleTechnique {
    id: string;

    order: number;

    module: Module;

    technique: Technique;
}
