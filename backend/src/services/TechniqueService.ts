import { NewTechnique, UpdateTechnique } from 'common';
import { AppDataSource } from '../data-source';
import { CollectionTechnique } from '../entities/CollectionTechnique';
import { OpenGuard } from '../entities/OpenGuard';
import { Position } from '../entities/Position';
import { Technique } from '../entities/Technique';
import { TechniqueType } from '../entities/TechniqueType';
import { StudentTechnique } from '../entities/StudentTechnique';

export class TechniqueService {
    async createTechnique(data: { technique: NewTechnique }): Promise<Technique> {
        const techniqueRepo = AppDataSource.getRepository(Technique);
        const typeRepo = AppDataSource.getRepository(TechniqueType);
        const positionRepo = AppDataSource.getRepository(Position);
        const openGuardRepo = AppDataSource.getRepository(OpenGuard);

        let type = await typeRepo.findOne({ where: { title: data.technique.type.title } });
        if (!type && data.technique.type.title && data.technique.type.description) {
            type = typeRepo.create({ title: data.technique.type.title, description: data.technique.type.description });
            await typeRepo.save(type);
        }

        let position = await positionRepo.findOne({ where: { title: data.technique.position.title } });
        if (!position && data.technique.position.title && data.technique.position.description) {
            position = positionRepo.create({ title: data.technique.position.title, description: data.technique.position.description });
            await positionRepo.save(position);
        }

        let openGuard = null
        if (data.technique.openGuard) {
            openGuard = await openGuardRepo.findOne({ where: { title: data.technique.openGuard.title } });
            if (!openGuard && data.technique.openGuard.title && data.technique.openGuard.description) {
                openGuard = openGuardRepo.create({ title: data.technique.openGuard.title, description: data.technique.openGuard.description });
                await openGuardRepo.save(openGuard);
            }
        }

        let technique = new Technique();

        technique.title = data.technique.title;
        technique.videos = data.technique.videos ?? null;
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

    async updateTechnique(data: { technique: UpdateTechnique }): Promise<Technique> {
        const techniqueRepo = AppDataSource.getRepository(Technique);
        const typeRepo = AppDataSource.getRepository(TechniqueType);
        const positionRepo = AppDataSource.getRepository(Position);
        const openGuardRepo = AppDataSource.getRepository(OpenGuard);

        let type = await typeRepo.findOne({ where: { title: data.technique.type.title } });
        if (!type && data.technique.type.title && data.technique.type.description) {
            type = typeRepo.create({ title: data.technique.type.title, description: data.technique.type.description });
            await typeRepo.save(type);
        }

        let position = await positionRepo.findOne({ where: { title: data.technique.position.title } });
        if (!position && data.technique.position.title && data.technique.position.description) {
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

        let technique: Partial<Technique> = {};
        technique = await techniqueRepo.findOne({ where: { techniqueId: data.technique.techniqueId } });
        if (!technique) {
            throw new Error('Technique not found');
        }

        await techniqueRepo.update({ techniqueId: technique.techniqueId }, {
            title: data.technique.title,
            videos: data.technique.videos ?? null,
            description: data.technique.description,
            globalNotes: data.technique.globalNotes ?? null,
            gi: data.technique.gi,
            hierarchy: data.technique.hierarchy,
            type: type,
            position: position,
            openGuard: openGuard ?? null,
        })

        if (technique) {
            return await techniqueRepo.findOne({ where: { techniqueId: data.technique.techniqueId },
                relations: ["type", "position", "openGuard"]
            })
        }
    };

    async deleteTechnique(data: { techniqueId: string }) {
        const techniqueRepo = AppDataSource.getRepository(Technique);
        const collectionTechniqueRepo = AppDataSource.getRepository(CollectionTechnique)
        const studentTechniqueRepo = AppDataSource.getRepository(StudentTechnique)

        const technique = await techniqueRepo.findOne({ where: { techniqueId: data.techniqueId } })

        if (technique) {
            try {

                await collectionTechniqueRepo.createQueryBuilder()
                    .delete()
                    .from(CollectionTechnique)
                    .where("technique = :technique", { technique: technique.techniqueId })
                    .execute();

                await studentTechniqueRepo.createQueryBuilder()
                    .delete()
                    .from(StudentTechnique)
                    .where("technique = :technique", { technique: technique.techniqueId })
                    .execute();

                await techniqueRepo.createQueryBuilder()
                    .delete()
                    .from(Technique)
                    .where("techniqueId = :techniqueId", { techniqueId: technique.techniqueId })
                    .execute();

            } catch (error) {
                console.log(`${error}`)
            }

        }
    }

    async getAllTechniqueTitlesWithDescriptions(): Promise<Technique[]> {
        const techniqueRepo = AppDataSource.getRepository(Technique);
        const techniques = techniqueRepo.find({ select: ["title", "description"] })

        return techniques
    };

    async getAllTechniques(): Promise<Technique[]> {
        const techniqueRepo = AppDataSource.getRepository(Technique);
        return await techniqueRepo.find({
            relations: ["type", "position", "openGuard"]
        })

    };

    async getAllTypes(): Promise<TechniqueType[]> {
        const typeRepo = AppDataSource.getRepository(TechniqueType);
        return await typeRepo.find({ select: ["title", "description"] })
    };

    async getAllPositions(): Promise<Position[]> {
        const positionRepo = AppDataSource.getRepository(Position);
        return await positionRepo.find({ select: ["title", "description"] })
    };

    async getAllOpenGuards(): Promise<OpenGuard[]> {
        const openGuardRepo = AppDataSource.getRepository(OpenGuard);
        return await openGuardRepo.find({ select: ["title", "description"] })
    };
};
