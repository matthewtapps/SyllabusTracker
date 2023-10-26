import { TechniqueType } from '../entities/TechniqueType';
import { Position } from '../entities/Position';
import { OpenGuard } from '../entities/OpenGuard';
import { AppDataSource } from '../data-source';
import { Module } from '../entities/Module';
import { Technique } from '../entities/Technique';
import { ModuleTechnique } from '../entities/ModuleTechnique';

export class ModuleService {
    async createOrUpdateModule(data: any): Promise<Module> {
        const moduleRepo = AppDataSource.getRepository(Module);
        const techniqueRepo = AppDataSource.getRepository(Technique);
        const moduleTechniqueRepo = AppDataSource.getRepository(ModuleTechnique)
        const typeRepo = AppDataSource.getRepository(TechniqueType);
        const positionRepo = AppDataSource.getRepository(Position);
        const openGuardRepo = AppDataSource.getRepository(OpenGuard);

        let module = new Module();
        module.title = data.title;
        module.description = data.description;
        module.globalNotes = data.globalNotes;
        module.gi = data.gi;
        module.hierarchy = data.hierarchy;

        if (data.type) {
            let type = await typeRepo.findOne({ where: { title: data.type }});
            module.type = type;
        }

        if (data.position) {
            let position = await positionRepo.findOne({ where: { title: data.position }});
            module.position = position;
        }

        if (data.openGuard) {
            let openGuard = await openGuardRepo.findOne({ where: { title: data.openGuard } });
            module.openGuard = openGuard
        }

        module = await moduleRepo.save(module)

        const moduleTechniques: ModuleTechnique[] = [];
        
        for (const technique of data.moduleTechniques) {
            const techniqueId = technique.techniqueId
            const techniqueToAdd = await techniqueRepo.findOne(techniqueId)
            if (!techniqueToAdd) {
                throw new Error(`Technique with id ${techniqueId} not found.`);
            }

            const moduleTechnique = new ModuleTechnique();
            moduleTechnique.module = module;
            moduleTechnique.technique = techniqueToAdd;
            moduleTechnique.order = technique.order + 1;
            
            moduleTechniques.push(moduleTechnique)
        };

        await moduleTechniqueRepo.save(moduleTechniques);

        return module
    };

    async getAllModuleTitles(): Promise<Module[]> {
        const moduleRepo = AppDataSource.getRepository(Module);
        const modules = await moduleRepo.find({ select: ["title"]})

        return modules
    };

    async getAllModules(): Promise<Module[]> {
        const moduleRepo = AppDataSource.getRepository(Module);
        const modules = await moduleRepo.find({
            relations: ["type", "position", "openGuard", "techniques"]
        })

        return modules
    };
};
