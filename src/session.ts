import { Technique } from './types/Technique';
import { StudentTechnique } from './types/StudentTechnique';
import { InstanceTechnique } from './types/InstanceTechnique';
import { retrieveGlobalTechniques } from './utils/retrieveGlobalTechniques';
import { retrieveStudentTechniques } from './utils/retrieveStudentTechniques';

const userId = 1; // User ID for testing purposes

const techniques: Technique[] = retrieveGlobalTechniques();
const studentTechniques: StudentTechnique[] = retrieveStudentTechniques();

// const instanceTechniques: InstanceTechnique[] = studentTechniques
//   .filter(studentTechnique => studentTechnique.userId === userId)
//   .map(studentTechnique => {
//       const technique = techniques.find(technique => technique.techniqueId === studentTechnique.techniqueId);
//       return {
//           ...technique,
//           status: studentTechnique.status,
//           studentNotes: studentTechnique.studentNotes,
//           coachNotes: studentTechnique.coachNotes
//       } as InstanceTechnique;
//   });

console.log(studentTechniques);