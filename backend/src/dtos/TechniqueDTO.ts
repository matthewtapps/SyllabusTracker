import { Gi, Hierarchy } from "common";

export default class TechniqueDTO {
    title: string;
    videoSrc: string | undefined;
    description: string;
    globalNotes: string | undefined;
    gi: Gi;
    hierarchy: Hierarchy;
    type: {
        title: string,
        description: string
    }
    position: {
        title: string,
        description: string
    }
    openGuard: {
        title: string,
        description: string
    } | null
}
