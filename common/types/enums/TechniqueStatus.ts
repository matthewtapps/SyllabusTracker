export enum TechniqueStatus {
    Unassigned = "Unassigned",
    Passed = "Passed",
    Started = "Started",
    NotYetStarted = "Not Yet Started"
}

export function stringToTechniqueStatus(value: string): TechniqueStatus {
    if (Object.values(TechniqueStatus).includes(value as TechniqueStatus)) {
        return value as TechniqueStatus;
    }
    throw new Error(`Invalid Technique Status Value: ${value}`)
}
