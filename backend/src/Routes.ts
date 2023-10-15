import { Router } from 'express';
import { TechniqueController } from './controllers/TechniqueController';

const router = Router();

router.post('/technique', TechniqueController.createOrUpdateTechnique);

export default router;
