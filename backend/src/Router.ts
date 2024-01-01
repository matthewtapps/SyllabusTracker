import { Router } from 'express';
import { TechniqueController } from './controllers/TechniqueController';
import { CollectionController } from './controllers/CollectionController';
import { StudentController } from './controllers/StudentController';
import { StudentTechniqueController } from './controllers/StudentTechniqueController';

const router = Router();

router.post('/technique', TechniqueController.createTechnique);
router.put('/technique', TechniqueController.updateTechnique);
router.get('/technique', TechniqueController.getAllTechniques);
router.delete('/technique', TechniqueController.deleteTechnique);
router.get('/type', TechniqueController.getAllTypes);
router.get('/technique/titles', TechniqueController.getAllTechniqueTitlesWithDescriptions)
router.get('/position', TechniqueController.getAllPositions);
router.get('/openguard', TechniqueController.getAllOpenGuards);
router.post('/collection', CollectionController.createCollection);
router.put('/collection', CollectionController.updateCollection);
router.get('/collection', CollectionController.getAllCollections);
router.delete('/collection', CollectionController.deleteCollection);
router.get('/collection/titles', CollectionController.getAllCollectionTitles);
router.post('/collectionTechnique', CollectionController.setCollectionTechniques);
router.get('/collectiontechnique', CollectionController.getCollectionTechniques);
router.get('/students', StudentController.fetchStudents);
router.post('/student-techniques', StudentTechniqueController.addStudentTechniques)
router.put('/student-technique/:userId/:techniqueId', StudentTechniqueController.updateStudentTechnique)
router.get('/student-technique/:userId', StudentTechniqueController.getStudentTechniques)

export default router;
