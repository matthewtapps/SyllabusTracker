import { Technique } from './Types'
import { TechniqueStatus, stringToTechniqueStatus } from './Types';

export interface InstanceTechnique extends Technique {
    status: TechniqueStatus;
    studentNotes: string;
    coachNotes: string;
}
