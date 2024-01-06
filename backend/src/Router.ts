import { Router } from 'express';
import { CollectionController } from './controllers/CollectionController';
import { CollectionSetController } from './controllers/CollectionSetController';
import { StudentController } from './controllers/StudentController';
import { StudentTechniqueController } from './controllers/StudentTechniqueController';
import { TechniqueController } from './controllers/TechniqueController';

const router = Router();

router.get('/technique', TechniqueController.getAllTechniques);
router.post('/technique', TechniqueController.createTechnique);
router.put('/technique/:techniqueId', TechniqueController.updateTechnique);
router.delete('/technique/:techniqueId', TechniqueController.deleteTechnique);
router.get('/technique/descriptions', TechniqueController.getDescriptions);
router.get('/technique/suggestions', TechniqueController.getSuggestions)

router.get('/type', TechniqueController.getAllTypes);
router.get('/technique/titles', TechniqueController.getAllTechniqueTitlesWithDescriptions);
router.get('/position', TechniqueController.getAllPositions);
router.get('/openguard', TechniqueController.getAllOpenGuards);

router.get('/collection', CollectionController.getAllCollections);
router.post('/collection', CollectionController.createCollection);
router.post('/collection/:collectionId', CollectionController.setCollectionTechniques);
router.put('/collection/:collectionId', CollectionController.updateCollection);
router.delete('/collection/:collectionId', CollectionController.deleteCollection);
router.get('/collection/suggestions', CollectionController.getSuggestions)

router.get('/collectiontechnique', CollectionController.getCollectionTechniques);

router.get('/student', StudentController.fetchStudents);
router.get('/student/:userId/technique', StudentTechniqueController.fetchStudentTechniques)
router.post('/student/:userId/technique', StudentTechniqueController.postStudentTechniques)
router.post('/student/:userId/technique/:techniqueId', StudentTechniqueController.postStudentTechnique)
router.put('/student/:userId/technique/:studentTechniqueId', StudentTechniqueController.updateStudentTechnique)
router.get('/student/technique', StudentTechniqueController.fetchAllStudentTechniques)
router.delete('/student/technique/:studentTechniqueId', StudentTechniqueController.deleteStudentTechnique)

router.get('/collectionset', CollectionSetController.getCollectionSets)
router.post('/collectionset', CollectionSetController.createCollectionSet)
router.put('/collectionset/:collectionSetId', CollectionSetController.setCollections)
router.delete('/collectionset/:collectionSetId', CollectionSetController.deleteCollectionSet)

export default router;
