import { Router } from 'express';
import { TechniqueController } from './controllers/TechniqueController';
import { CollectionController } from './controllers/CollectionController';
import { StudentController } from './controllers/StudentController';
import { StudentTechniqueController } from './controllers/StudentTechniqueController';
import { CollectionSetController } from './controllers/CollectionSetController';

const router = Router();

router.get('/technique', TechniqueController.getAllTechniques);
router.post('/technique', TechniqueController.createTechnique);
router.put('/technique/:techniqueId', TechniqueController.updateTechnique);
router.delete('/technique/:techniqueId', TechniqueController.deleteTechnique);

router.get('/type', TechniqueController.getAllTypes);
router.get('/technique/titles', TechniqueController.getAllTechniqueTitlesWithDescriptions)
router.get('/position', TechniqueController.getAllPositions);
router.get('/openguard', TechniqueController.getAllOpenGuards);

router.get('/collection', CollectionController.getAllCollections);
router.post('/collection', CollectionController.createCollection);
router.put('/collection/:collectionId', CollectionController.updateCollection);
router.delete('/collection/:collectionId', CollectionController.deleteCollection);

router.get('/collectiontechnique', CollectionController.getCollectionTechniques);
router.post('/collectiontechnique/:collectionId', CollectionController.setCollectionTechniques);

router.get('/student', StudentController.fetchStudents);
router.get('/student/:userId/technique', StudentTechniqueController.fetchStudentTechniques)
router.post('/student/:userId/technique', StudentTechniqueController.addStudentTechniques)
router.put('/student/:userId/technique/:techniqueId', StudentTechniqueController.updateOrPostStudentTechnique)
router.get('/student/technique', StudentTechniqueController.fetchAllStudentTechniques)
router.delete('/student/technique/:techniqueId', StudentTechniqueController.deleteStudentTechnique)

router.get('/collectionset', CollectionSetController.getCollectionSets)
router.post('/collectionset', CollectionSetController.createCollectionSet)
router.put('/collectionset/:collectionSetId', CollectionSetController.setCollections)
router.delete('collectionset/:collectionSetId', CollectionSetController.deleteCollectionSet)

export default router;
