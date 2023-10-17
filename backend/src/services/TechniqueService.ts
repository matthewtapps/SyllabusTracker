import { Technique } from '../entities/Technique';
import { TechniqueType } from '../entities/TechniqueType';
import { Position } from '../entities/Position';
import { OpenGuard } from '../entities/OpenGuard';
import { AppDataSource } from '../data-source';

export class TechniqueService {
    async createOrUpdateTechnique(data: any): Promise<Technique> {
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
                openGuard = openGuardRepo.create({ title: data.openGuard });
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
        technique._type = type;
        technique._position = position;
        technique._openGuard = openGuard;

        return await techniqueRepo.save(technique);
    };

    async getAllTechniqueTitles(): Promise<Technique[]> {
        const techniqueRepo = AppDataSource.getRepository(Technique);
        const techniques = techniqueRepo.find({ select: ["title"]})

        return techniques
    };

    async getAllTechniques(): Promise<Technique[]> {
        const techniqueRepo = AppDataSource.getRepository(Technique);
        const techniques = techniqueRepo.find()

        return techniques
    };

    async getAllTechniqueTypes(): Promise<TechniqueType[]> {
        const typeRepo = AppDataSource.getRepository(TechniqueType);
        return typeRepo.find({ select: ["title"]})
    };

    async getAllTechniquePositions(): Promise<Position[]> {
        const typeRepo = AppDataSource.getRepository(Position);
        return typeRepo.find({ select: ["title"]})
    };

    async getAllTechniqueOpenGuards(): Promise<OpenGuard[]> {
        const typeRepo = AppDataSource.getRepository(OpenGuard);
        return typeRepo.find({ select: ["title"]})
    };
};
