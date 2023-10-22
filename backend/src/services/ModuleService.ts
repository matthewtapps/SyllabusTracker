import { Technique } from '../entities/Technique';
import { TechniqueType } from '../entities/TechniqueType';
import { Position } from '../entities/Position';
import { OpenGuard } from '../entities/OpenGuard';
import { AppDataSource } from '../data-source';
import { Module } from '../entities/Module';

export class ModuleService {
    async createOrUpdateModule(data: any): Promise<Technique> {
        const techniqueRepo = AppDataSource.getRepository(Technique);
        const typeRepo = AppDataSource.getRepository(TechniqueType);
        const positionRepo = AppDataSource.getRepository(Position);
        const openGuardRepo = AppDataSource.getRepository(OpenGuard);
        
        let type = await typeRepo.findOne({ where: { title: data.type }});
        if (!type && data.typeDescription) {
            type = typeRepo.create({ title: data.type, description: data.typeDescription });
            await typeRepo.save(type);
        }

        let position = await positionRepo.findOne({ where: { title: data.position }});
        if (!position && data.positionDescription) {
            position = positionRepo.create({ title: data.position, description: data.positionDescription });
            await positionRepo.save(position);
        }

        let openGuard = null;
        if (data.openGuard) {
            openGuard = await openGuardRepo.findOne({ where: { title: data.openGuard } });
            if (!openGuard) {
                openGuard = openGuardRepo.create({ title: data.openGuard, description: data.openGuardDescription });
                await openGuardRepo.save(openGuard);
            }
        }

        let technique = new Technique();
        technique.title = data.title;
        technique.videoSrc = data.videoSrc;
        technique.description = data.description;
        technique.globalNotes = data.globalNotes;
        technique.gi = data.gi;
        technique.hierarchy = data.hierarchy;
        technique.type = type;
        technique.position = position;
        if (openGuard) {
            technique.openGuard = openGuard;
        }

        return await techniqueRepo.save(technique);
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
