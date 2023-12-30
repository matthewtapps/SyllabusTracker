import { Technique } from '../entities/Technique';
import { TechniqueType } from '../entities/TechniqueType';
import { Position } from '../entities/Position';
import { OpenGuard } from '../entities/OpenGuard';
import { AppDataSource } from '../data-source';
import { NewTechnique, UpdateTechnique } from 'common';
import { CollectionTechnique } from '../entities/CollectionTechnique';

export class TechniqueService {
    async createTechnique(data: {technique: NewTechnique}): Promise<Technique> {
        const techniqueRepo = AppDataSource.getRepository(Technique);
        const typeRepo = AppDataSource.getRepository(TechniqueType);
        const positionRepo = AppDataSource.getRepository(Position);
        const openGuardRepo = AppDataSource.getRepository(OpenGuard);
      
        let type = await typeRepo.findOne({ where: { title: data.technique.type.title }});
        if (!type && data.technique.type.title && data.technique.type.description) {
            type = typeRepo.create({ title: data.technique.type.title, description: data.technique.type.description });
            await typeRepo.save(type);
        }

        let position = await positionRepo.findOne({ where: { title: data.technique.position.title }});
        if (!position&& data.technique.position.title && data.technique.position.description) {
            position = positionRepo.create({ title: data.technique.position.title, description: data.technique.position.description });
            await positionRepo.save(position);
        }

        let openGuard = null
        if (data.technique.openGuard) {
            openGuard = await openGuardRepo.findOne({ where: { title: data.technique.openGuard.title } });
            if (!openGuard && data.technique.openGuard.title && data.technique.openGuard.description) {
                if (!openGuard && data.technique.openGuard.title) {
                    openGuard = openGuardRepo.create({ title: data.technique.openGuard.title, description: data.technique.openGuard.description });
                    await openGuardRepo.save(openGuard);
                }
            }
        }

        let technique = new Technique();

        technique.title = data.technique.title;
        technique.videoSrc = data.technique.videoSrc ?? null;
        technique.description = data.technique.description;
        technique.globalNotes = data.technique.globalNotes ?? null;
        technique.gi = data.technique.gi;
        technique.hierarchy = data.technique.hierarchy;
        technique.type = type;
        technique.position = position;
        if (openGuard) {
            technique.openGuard = openGuard;
        } else technique.openGuard = null;

        return await techniqueRepo.save(technique);
    };

    async updateTechnique(data: {technique: UpdateTechnique}): Promise<Technique> {
        const techniqueRepo = AppDataSource.getRepository(Technique);
        const typeRepo = AppDataSource.getRepository(TechniqueType);
        const positionRepo = AppDataSource.getRepository(Position);
        const openGuardRepo = AppDataSource.getRepository(OpenGuard);
      
        let type = await typeRepo.findOne({ where: { title: data.technique.type.title }});
        if (!type && data.technique.type.title && data.technique.type.description) {
            type = typeRepo.create({ title: data.technique.type.title, description: data.technique.type.description });
            await typeRepo.save(type);
        }

        let position = await positionRepo.findOne({ where: { title: data.technique.position.title }});
        if (!position&& data.technique.position.title && data.technique.position.description) {
            position = positionRepo.create({ title: data.technique.position.title, description: data.technique.position.description });
            await positionRepo.save(position);
        }

        let openGuard = null
        if (data.technique.openGuard) {
            openGuard = await openGuardRepo.findOne({ where: { title: data.technique.openGuard.title } });
            if (!openGuard && data.technique.openGuard.title && data.technique.openGuard.description) {
                if (!openGuard && data.technique.openGuard.title) {
                    openGuard = openGuardRepo.create({ title: data.technique.openGuard.title, description: data.technique.openGuard.description });
                    await openGuardRepo.save(openGuard);
                }
            }
        }

        let technique;
        technique = await techniqueRepo.findOne({ where: { techniqueId: data.technique.techniqueId }});
        if (!technique) {
            throw new Error('Technique not found');
        }
         
        technique.title = data.technique.title;
        technique.videoSrc = data.technique.videoSrc ?? null;
        technique.description = data.technique.description;
        technique.globalNotes = data.technique.globalNotes ?? null;
        technique.gi = data.technique.gi;
        technique.hierarchy = data.technique.hierarchy;
        technique.type = type;
        technique.position = position;
        if (openGuard) {
            technique.openGuard = openGuard;
        } else technique.openGuard = null;

        return await techniqueRepo.save(technique);
    };

    async deleteTechnique(data: {techniqueId: string}) {
        const techniqueRepo = AppDataSource.getRepository(Technique);
        const collectionTechniqueRepo = AppDataSource.getRepository(CollectionTechnique)

        const technique = await techniqueRepo.findOne({ where: { techniqueId: data.techniqueId} })

        if (technique) {await collectionTechniqueRepo.createQueryBuilder()
            .delete()
            .from(CollectionTechnique)
            .where("technique = :technique", { technique: technique.techniqueId })
            .execute();}

        if (technique) {await techniqueRepo.createQueryBuilder()
            .delete()
            .from(Technique)
            .where("techniqueId = :techniqueId", { techniqueId: data.techniqueId })
            .execute();}
    }

    async getAllTechniqueTitles(): Promise<Technique[]> {
        const techniqueRepo = AppDataSource.getRepository(Technique);
        const techniques = techniqueRepo.find({ select: ["title"]})

        return techniques
    };

    async getAllTechniques(): Promise<Technique[]> {
        const techniqueRepo = AppDataSource.getRepository(Technique);
        const techniques = await techniqueRepo.find({
            relations: ["type", "position", "openGuard"]
        })

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
