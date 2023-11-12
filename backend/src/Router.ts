import { Router } from 'express';
import { TechniqueController } from './controllers/TechniqueController';
import { CollectionController } from './controllers/CollectionController';

const router = Router();

router.post('/technique', TechniqueController.createOrUpdateTechnique);
router.get('/technique', TechniqueController.getAllTechniques);
router.get('/technique/types', TechniqueController.getAllTechniqueTypes);
router.get('/technique/titles', TechniqueController.getAllTechniqueTitles)
router.get('/technique/positions', TechniqueController.getAllTechniquePositions);
router.get('/technique/openguards', TechniqueController.getAllTechniqueOpenGuards);
router.post('/newCollection', CollectionController.createNewCollection)
router.post('/addToCollection', CollectionController.setCollectionTechniques)
router.get('/collection', CollectionController.getAllCollections)
router.get('/collection/titles', CollectionController.getAllCollectionTitles)
router.get('/collectiontechnique', CollectionController.getCollectionTechniques)

export default router;
