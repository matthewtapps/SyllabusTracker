import { Router } from 'express';
import { TechniqueController } from './controllers/TechniqueController';

const router = Router();

router.post('/technique', TechniqueController.createOrUpdateTechnique);
router.get('/technique', TechniqueController.fetchAllTechniques)

export default router;
