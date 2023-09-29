export enum TechniqueStatus {
    Passed = "Passed",
    Started = "Started",
    NotYetStarted = "Not yet started"
}

export function stringToTechniqueStatus(value: string): TechniqueStatus {
    if (Object.values(TechniqueStatus).includes(value as TechniqueStatus)) {
        return value as TechniqueStatus;
    }
    throw new Error(`Invalid Technique Status Value: ${value}`)
}
