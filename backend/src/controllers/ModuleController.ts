import { Request, Response } from 'express';
import { ModuleService } from '../services/ModuleService';

export class ModuleController {
    static async createOrUpdateModule(req: Request, res: Response) {
        const moduleService = new ModuleService();
        try {
            const module = await moduleService.createOrUpdateModule(req.body);
            res.json(module);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getAllModules(req: Request, res: Response) {
        const moduleService = new ModuleService();
        try {
            const modules = await moduleService.getAllModules();
            res.json(modules);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getAllModuleTitles(req: Request, res: Response) {
        const moduleService = new ModuleService();
        try {
            const moduleTitles = await moduleService.getAllModuleTitles();
            res.json(moduleTitles);
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    }
}
