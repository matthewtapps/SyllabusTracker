import { Request, Response } from 'express';
import { TechniqueService } from '../services/TechniqueService';

export class TechniqueController {
    static async createOrUpdateTechnique(req: Request, res: Response) {
        const techniqueService = new TechniqueService();
        try {
            const technique = await techniqueService.createOrUpdateTechnique(req.body);
            res.json(technique);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async fetchAllTechniques(req: Request, res: Response) {
        const techniqueService = new TechniqueService();
        try {
            const techniques = await techniqueService.fetchAllTechniques();
            res.json(techniques)
        } catch (error) {
            res.status(400).json({error: error.message})
        }
    }
}
