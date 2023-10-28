import { Gi, Hierarchy, CollectionTechnique } from 'common';

export default class CollectionDTO {
    title: string;
    description: string;
    globalNotes: string;
    gi?: Gi | undefined;
    hierarchy?: Hierarchy | undefined;
    position?: string | undefined;
    type?: string | undefined;
    openGuard?: string | undefined;
} 
