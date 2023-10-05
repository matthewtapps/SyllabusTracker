import { Technique } from './Technique'
import { TechniqueStatus, stringToTechniqueStatus } from './enums/TechniqueStatus';

export interface InstanceTechnique extends Technique {
    status: TechniqueStatus;
    studentNotes: string;
    coachNotes: string;
}
