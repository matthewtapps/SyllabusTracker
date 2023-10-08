import { Technique } from './Types';
import { TechniqueStatus } from './Types';
export interface InstanceTechnique extends Technique {
    status: TechniqueStatus;
    studentNotes: string;
    coachNotes: string;
}
