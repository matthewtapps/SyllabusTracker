import { Gi, Hierarchy } from "common";

class DTO{
    title: string
    description: string
}

export default class TechniqueDTO {
    techniqueId: string;
    title: string;
    videoSrc: string;
    description: string;
    globalNotes: string;
    gi: Gi;
    hierarchy: Hierarchy;
    type: DTO;
    position: DTO;
    openGuard?: DTO;
}
