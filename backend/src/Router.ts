import { Router } from 'express';
import { TechniqueController } from './controllers/TechniqueController';
import { CollectionController } from './controllers/CollectionController';
import { StudentController } from './controllers/StudentController';

const router = Router();

router.post('/technique', TechniqueController.createOrUpdateTechnique);
router.get('/technique', TechniqueController.getAllTechniques);
router.get('/technique/types', TechniqueController.getAllTechniqueTypes);
router.get('/technique/titles', TechniqueController.getAllTechniqueTitles)
router.get('/technique/positions', TechniqueController.getAllTechniquePositions);
router.get('/technique/openguards', TechniqueController.getAllTechniqueOpenGuards);
router.post('/newCollection', CollectionController.createOrUpdateCollection);
router.post('/addToCollection', CollectionController.setCollectionTechniques);
router.get('/collection', CollectionController.getAllCollections);
router.get('/collection/titles', CollectionController.getAllCollectionTitles);
router.get('/collectiontechnique', CollectionController.getCollectionTechniques);
router.post('/deleteCollection', CollectionController.deleteCollection);
router.post('/deleteTechnique', TechniqueController.deleteTechnique)
router.get('/students', StudentController.fetchStudents);

export default router;
