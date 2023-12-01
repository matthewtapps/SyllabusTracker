import { Gi, Hierarchy } from 'common';

export default class CollectionDTO {
    title: string;
    description: string;
    globalNotes: string | null;
    gi: Gi | null;
    hierarchy: Hierarchy | null;
    type: {
        title: string,
        description: string
    } | null
    position: {
        title: string,
        description: string
    } | null
    openGuard: {
        title: string,
        description: string
    } | null
} 
