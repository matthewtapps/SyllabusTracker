import { Technique } from '../backend/types/Technique';
import { StudentTechnique } from '../backend/types/StudentTechnique';
import { InstanceTechnique } from '../backend/types/InstanceTechnique';
import { retrieveGlobalTechniques } from '../backend/utils/retrieveGlobalTechniques';
import { retrieveStudentTechniques } from '../backend/utils/retrieveStudentTechniques';
import { retrieveInstanceTechniques } from '../backend/utils/retrieveInstanceTechniques';

const userId = 1; // User ID for testing purposes

const techniques: Technique[] = retrieveGlobalTechniques();
const studentTechniques: StudentTechnique[] = retrieveStudentTechniques(userId);

const instanceTechniques: InstanceTechnique[] = retrieveInstanceTechniques(
    techniques, 
    studentTechniques,
    );

console.log(instanceTechniques);
