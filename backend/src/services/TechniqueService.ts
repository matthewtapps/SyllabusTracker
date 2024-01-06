import { NewTechnique, UpdateTechnique } from 'common';
import { AppDataSource } from '../data-source';
import { CollectionTechnique } from '../entities/CollectionTechnique';
import { OpenGuard } from '../entities/OpenGuard';
import { Position } from '../entities/Position';
import { Technique } from '../entities/Technique';
import { TechniqueType } from '../entities/TechniqueType';
import { StudentTechnique } from '../entities/StudentTechnique';

export class TechniqueService {
    async createTechnique(newTechnique: NewTechnique): Promise<Technique> {
        const techniqueRepo = AppDataSource.getRepository(Technique);
        const typeRepo = AppDataSource.getRepository(TechniqueType);
        const positionRepo = AppDataSource.getRepository(Position);
        const openGuardRepo = AppDataSource.getRepository(OpenGuard);

        let type = await typeRepo.findOne({ where: { title: newTechnique.type.title } });
        if (!type && newTechnique.type.title && newTechnique.type.description) {
            type = typeRepo.create({ title: newTechnique.type.title, description: newTechnique.type.description });
            await typeRepo.save(type);
        }

        let position = await positionRepo.findOne({ where: { title: newTechnique.position.title } });
        if (!position && newTechnique.position.title && newTechnique.position.description) {
            position = positionRepo.create({ title: newTechnique.position.title, description: newTechnique.position.description });
            await positionRepo.save(position);
        }

        let openGuard = null
        if (newTechnique.openGuard) {
            openGuard = await openGuardRepo.findOne({ where: { title: newTechnique.openGuard.title } });
            if (!openGuard && newTechnique.openGuard.title && newTechnique.openGuard.description) {
                openGuard = openGuardRepo.create({ title: newTechnique.openGuard.title, description: newTechnique.openGuard.description });
                await openGuardRepo.save(openGuard);
            }
        }

        let technique = new Technique();

        technique.title = newTechnique.title;
        technique.videos = newTechnique.videos ?? null;
        technique.description = newTechnique.description;
        technique.globalNotes = newTechnique.globalNotes ?? null;
        technique.gi = newTechnique.gi;
        technique.hierarchy = newTechnique.hierarchy;
        technique.type = type;
        technique.position = position;
        if (openGuard) {
            technique.openGuard = openGuard;
        } else technique.openGuard = null;

        return await techniqueRepo.save(technique);
    };

    async updateTechnique(technique: UpdateTechnique): Promise<Technique> {
        const techniqueRepo = AppDataSource.getRepository(Technique);
        const typeRepo = AppDataSource.getRepository(TechniqueType);
        const positionRepo = AppDataSource.getRepository(Position);
        const openGuardRepo = AppDataSource.getRepository(OpenGuard);

        if (!await techniqueRepo.findOne({ where: { techniqueId: technique.techniqueId } })) {
            throw new Error('Technique not found to update');
        }

        let type = await typeRepo.findOne({ where: { title: technique.type.title } });
        if (!type && technique.type.title && technique.type.description) {
            type = typeRepo.create({ title: technique.type.title, description: technique.type.description });
            await typeRepo.save(type);
        }

        let position = await positionRepo.findOne({ where: { title: technique.position.title } });
        if (!position && technique.position.title && technique.position.description) {
            position = positionRepo.create({ title: technique.position.title, description: technique.position.description });
            await positionRepo.save(position);
        }

        let openGuard = null
        if (technique.openGuard) {
            openGuard = await openGuardRepo.findOne({ where: { title: technique.openGuard.title } });
            if (!openGuard && technique.openGuard.title && technique.openGuard.description) {
                if (!openGuard && technique.openGuard.title) {
                    openGuard = openGuardRepo.create({ title: technique.openGuard.title, description: technique.openGuard.description });
                    await openGuardRepo.save(openGuard);
                }
            }
        }

        await techniqueRepo.update({ techniqueId: technique.techniqueId }, {
            title: technique.title,
            videos: technique.videos ?? null,
            description: technique.description,
            globalNotes: technique.globalNotes ?? null,
            gi: technique.gi,
            hierarchy: technique.hierarchy,
            type: type,
            position: position,
            openGuard: openGuard ?? null,
        })

        if (technique) {
            return await techniqueRepo.findOne({ where: { techniqueId: technique.techniqueId },
                relations: ["type", "position", "openGuard"]
            })
        }
    };

    async deleteTechnique(techniqueId: string) {
        const techniqueRepo = AppDataSource.getRepository(Technique);
        const collectionTechniqueRepo = AppDataSource.getRepository(CollectionTechnique)
        const studentTechniqueRepo = AppDataSource.getRepository(StudentTechnique)

        const technique = await techniqueRepo.findOne({ where: { techniqueId: techniqueId } })

        if (technique) {
            try {

                await collectionTechniqueRepo.createQueryBuilder()
                    .delete()
                    .from(CollectionTechnique)
                    .where("technique = :technique", { technique: techniqueId })
                    .execute();

                await studentTechniqueRepo.createQueryBuilder()
                    .delete()
                    .from(StudentTechnique)
                    .where("technique = :technique", { technique: techniqueId })
                    .execute();

                await techniqueRepo.createQueryBuilder()
                    .delete()
                    .from(Technique)
                    .where("techniqueId = :techniqueId", { techniqueId: techniqueId })
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
