import { Router } from 'express';
import { TechniqueController } from './controllers/TechniqueController';
import { ModuleController } from './controllers/ModuleController';

const router = Router();

router.post('/technique', TechniqueController.createOrUpdateTechnique);
router.get('/technique', TechniqueController.getAllTechniques);
router.get('/technique/types', TechniqueController.getAllTechniqueTypes);
router.get('/technique/titles', TechniqueController.getAllTechniqueTitles)
router.get('/technique/positions', TechniqueController.getAllTechniquePositions);
router.get('/technique/openguards', TechniqueController.getAllTechniqueOpenGuards);
router.get('/module', ModuleController.getAllModules)
router.get('/module/titles', ModuleController.getAllModuleTitles)

export default router;
