import { Router } from 'express';
import { TechniqueController } from './controllers/TechniqueController';
import { CollectionController } from './controllers/ModuleController';

const router = Router();

router.post('/technique', TechniqueController.createOrUpdateTechnique);
router.get('/technique', TechniqueController.getAllTechniques);
router.get('/technique/types', TechniqueController.getAllTechniqueTypes);
router.get('/technique/titles', TechniqueController.getAllTechniqueTitles)
router.get('/technique/positions', TechniqueController.getAllTechniquePositions);
router.get('/technique/openguards', TechniqueController.getAllTechniqueOpenGuards);
router.post('/module', CollectionController.createOrUpdateCollection)
router.get('/module', CollectionController.getAllCollections)
router.get('/module/titles', CollectionController.getAllCollectionTitles)

export default router;
