import { Gi, Hierarchy } from "common";

export default class TechniqueDTO {
    title: string;
    videoSrc: string | undefined;
    description: string;
    globalNotes: string | undefined;
    gi: Gi;
    hierarchy: Hierarchy;
    type: string;
    typeDescription: string | undefined;
    position: string;
    positionDescription: string | undefined;
    openGuard: string | undefined;
    openGuardDescription: string | undefined;
}
