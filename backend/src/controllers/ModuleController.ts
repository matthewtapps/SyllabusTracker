import { Request, Response } from 'express';
import { ModuleService } from '../services/ModuleService';

export class ModuleController {
    static async createOrUpdateModule(req: Request, res: Response) {
        const moduleService = new ModuleService();
        try {
            const technique = await moduleService.createOrUpdateModule(req.body);
            res.json(technique);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getAllModules(req: Request, res: Response) {
        const moduleService = new ModuleService();
        try {
            const techniques = await moduleService.getAllModules();
            res.json(techniques);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getAllModuleTitles(req: Request, res: Response) {
        const moduleService = new ModuleService();
        try {
            const techniqueTitles = await moduleService.getAllModuleTitles();
            res.json(techniqueTitles);
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    }
}
