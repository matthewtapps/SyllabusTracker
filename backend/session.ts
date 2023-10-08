import { Technique } from '../shared/types/Technique';
import { StudentTechnique } from '../shared/types/StudentTechnique';
import { InstanceTechnique } from '../shared/types/InstanceTechnique';
import { retrieveGlobalTechniques } from './utils/retrieveGlobalTechniques';
import { retrieveStudentTechniques } from './utils/retrieveStudentTechniques';
import { retrieveInstanceTechniques } from './utils/retrieveInstanceTechniques';

const userId = 1; // User ID for testing purposes

const techniques: Technique[] = retrieveGlobalTechniques();
const studentTechniques: StudentTechnique[] = retrieveStudentTechniques(userId);

const instanceTechniques: InstanceTechnique[] = retrieveInstanceTechniques(
    techniques, 
    studentTechniques,
    );

console.log(instanceTechniques);
