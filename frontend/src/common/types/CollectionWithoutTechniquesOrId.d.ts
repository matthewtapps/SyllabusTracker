import { Gi, Hierarchy } from "./Types";
export interface CollectionWithoutTechniquesOrId {
    title: string;
    description: string;
    globalNotes?: string | null;
    gi?: Gi | null;
    hierarchy?: Hierarchy | null;
    type?: DTO | null;
    position?: DTO | null;
    openGuard?: DTO | null;
}
interface DTO {
    title: string;
    description: string;
}
export {};
