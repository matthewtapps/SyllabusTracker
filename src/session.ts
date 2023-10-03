import { Technique } from './types/Technique';
import { StudentTechnique } from './types/StudentTechnique';
import { InstanceTechnique } from './types/InstanceTechnique';
import { retrieveGlobalTechniques } from './utils/retrieveGlobalTechniques';
import { retrieveStudentTechniques } from './utils/retrieveStudentTechniques';
import { retrieveInstanceTechniques } from './utils/retrieveInstanceTechniques';

const userId = 1; // User ID for testing purposes

const techniques: Technique[] = retrieveGlobalTechniques();
const studentTechniques: StudentTechnique[] = retrieveStudentTechniques();

const instanceTechniques: InstanceTechnique[] = retrieveInstanceTechniques(
    techniques, 
    studentTechniques,
    userId
    );

console.log(instanceTechniques);
