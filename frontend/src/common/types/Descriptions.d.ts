interface DescriptionMap {
    [key: string]: {
        description: string;
        id: string;
    };
}
export interface Descriptions {
    'position': DescriptionMap;
    'openGuard': DescriptionMap;
    'type': DescriptionMap;
}
export {};
