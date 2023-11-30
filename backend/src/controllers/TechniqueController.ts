import { Request, Response } from 'express';
import { TechniqueService } from '../services/TechniqueService';

export class TechniqueController {
    static async createOrUpdateTechnique(req: Request, res: Response) {
        const techniqueService = new TechniqueService();
        try {
            const technique = await techniqueService.createOrUpdateTechnique(req.body);
            res.json(technique);
        } catch (error) {
            console.log(error)
            res.status(400).json({ error: error });
        }
    }

    static async getAllTechniques(req: Request, res: Response) {
        const techniqueService = new TechniqueService();
        try {
            const techniques = await techniqueService.getAllTechniques();
            res.json(techniques);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getAllTechniqueTitles(req: Request, res: Response) {
        const techniqueService = new TechniqueService();
        try {
            const techniqueTitles = await techniqueService.getAllTechniqueTitles();
            res.json(techniqueTitles);
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    }    
    static async getAllTechniqueTypes(req: Request, res: Response) {
        const techniqueService = new TechniqueService();
        try {
            const techniqueTypes = await techniqueService.getAllTechniqueTypes();
            res.json(techniqueTypes);
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    }

    static async getAllTechniquePositions(req: Request, res: Response) {
        const techniqueService = new TechniqueService();
        try {
            const techniquePositions = await techniqueService.getAllTechniquePositions();
            res.json(techniquePositions);
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    }

    static async getAllTechniqueOpenGuards(req: Request, res: Response) {
        const techniqueService = new TechniqueService();
        try {
            const techniqueOpenGuards = await techniqueService.getAllTechniqueOpenGuards();
            res.json(techniqueOpenGuards);
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    }
}
