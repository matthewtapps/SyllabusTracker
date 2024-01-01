import { Request, Response } from 'express';
import { TechniqueService } from '../services/TechniqueService';

export class TechniqueController {
    static async createTechnique(req: Request, res: Response) {
        const techniqueService = new TechniqueService();
        try {
            const technique = await techniqueService.createTechnique(req.body);
            res.json(technique);
        } catch (error) {
            console.log(error)
            res.status(400).json({ error: error });
        }
    }

    static async updateTechnique(req: Request, res: Response) {
        const techniqueService = new TechniqueService();
        try {
            const technique = await techniqueService.updateTechnique(req.body);
            res.json(technique);
        } catch (error) {
            console.log(error)
            res.status(400).json({ error: error });
        }
    }

    static async deleteTechnique(req: Request, res: Response) {
        const techniqueService = new TechniqueService()
        try {
            await techniqueService.deleteTechnique(req.body)
            res.status(200)
        } catch (error) {
            res.status(400).json({error: error.message})
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

    static async getAllTechniqueTitlesWithDescriptions(req: Request, res: Response) {
        const techniqueService = new TechniqueService();
        try {
            const techniqueTitles = await techniqueService.getAllTechniqueTitlesWithDescriptions();
            res.json(techniqueTitles);
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    }    
    static async getAllTypes(req: Request, res: Response) {
        const techniqueService = new TechniqueService();
        try {
            const techniqueTypes = await techniqueService.getAllTypes();
            res.json(techniqueTypes);
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    }

    static async getAllPositions(req: Request, res: Response) {
        const techniqueService = new TechniqueService();
        try {
            const techniquePositions = await techniqueService.getAllPositions();
            res.json(techniquePositions);
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    }

    static async getAllOpenGuards(req: Request, res: Response) {
        const techniqueService = new TechniqueService();
        try {
            const techniqueOpenGuards = await techniqueService.getAllOpenGuards();
            res.json(techniqueOpenGuards);
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    }
}
