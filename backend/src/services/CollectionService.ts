import { NewCollection, Suggestions, UpdateCollection } from 'common';
import { AppDataSource } from '../data-source';
import { Collection } from '../entities/Collection';
import { CollectionTechnique } from '../entities/CollectionTechnique';
import { OpenGuard } from '../entities/OpenGuard';
import { Position } from '../entities/Position';
import { Technique } from '../entities/Technique';
import { TechniqueType } from '../entities/TechniqueType';

export class CollectionService {
    async setCollectionTechniques(collectionId: string, techniques: { index: number, technique: Technique }[]): Promise<CollectionTechnique[]> {
        const techniqueRepo = AppDataSource.getRepository(Technique);
        const collectionTechniqueRepo = AppDataSource.getRepository(CollectionTechnique)
        const collectionRepo = AppDataSource.getRepository(Collection)

        try {
            const collection = await collectionRepo.findOne({ where: { collectionId: collectionId } })

            if (collection) {
                await collectionTechniqueRepo.createQueryBuilder()
                    .delete()
                    .from(CollectionTechnique)
                    .where("collection = :collection", { collection: collection.collectionId })
                    .execute();
            }

            const collectionTechniques: CollectionTechnique[] = [];

            for (let collectionTechnique of techniques) {
                const techniqueToAdd = await techniqueRepo.findOne({ where: { techniqueId: collectionTechnique.technique.techniqueId } })
                if (!techniqueToAdd) {
                    throw new Error(`Technique with id ${collectionTechnique.technique.techniqueId} not found in technique repo.`);
                }

                const newCollectionTechnique = new CollectionTechnique();
                newCollectionTechnique.technique = techniqueToAdd;
                newCollectionTechnique.order = collectionTechnique.index;
                newCollectionTechnique.collection = collection

                collectionTechniques.push(newCollectionTechnique)
            };

            await collectionTechniqueRepo.save(collectionTechniques);

            const returnObject = await collectionTechniqueRepo.createQueryBuilder("collectionTechnique")
                .leftJoinAndSelect("collectionTechnique.technique", "technique")
                .leftJoinAndSelect("technique.type", "type")
                .leftJoinAndSelect("technique.position", "position")
                .leftJoinAndSelect("technique.openGuard", "openGuard")
                .leftJoinAndSelect("collectionTechnique.collection", "collection")
                .where("collectionTechnique.collection = :collectionId", { collectionId: collectionId })
                .orderBy("collectionTechnique.order", "ASC")
                .getMany();

            return returnObject
            
        } catch (error) { console.error(`Error setting collection techniques: ${error}`) }
    }

    async createCollection(collection: NewCollection): Promise<Collection> {
        const collectionRepo = AppDataSource.getRepository(Collection);
        const typeRepo = AppDataSource.getRepository(TechniqueType);
        const positionRepo = AppDataSource.getRepository(Position);
        const openGuardRepo = AppDataSource.getRepository(OpenGuard);

        let newCollection = new Collection();

        newCollection.title = collection.title;
        newCollection.description = collection.description;
        newCollection.globalNotes = collection.globalNotes ?? null;
        newCollection.gi = collection.gi ?? null;
        newCollection.hierarchy = collection.hierarchy ?? null;

        if (newCollection.type) {
            let type = await typeRepo.findOne({ where: { title: collection.type.title } });
            if (!type && collection.type.title && collection.type.description) {
                type = typeRepo.create({ title: collection.type.title, description: collection.type.description });
                type = await typeRepo.save(type);
            }
            newCollection.type = type
        } else newCollection.type = null;

        if (newCollection.position) {
            let position = await positionRepo.findOne({ where: { title: collection.position.title } });
            if (!position && collection.position.title && collection.position.description) {
                position = positionRepo.create({ title: collection.position.title, description: collection.position.description });
                await positionRepo.save(position);
            }
            newCollection.position = position
        } else newCollection.position = null;

        if (newCollection.openGuard) {
            let openGuard = await openGuardRepo.findOne({ where: { title: collection.openGuard.title } });
            if (!openGuard && collection.openGuard.title && collection.openGuard.description) {
                openGuard = openGuardRepo.create({ title: collection.openGuard.title, description: collection.openGuard.description });
                await openGuardRepo.save(openGuard);
            }
            newCollection.openGuard = openGuard
        } else newCollection.openGuard = null;

        return await collectionRepo.save(newCollection)
    };

    async updateCollection(collection: UpdateCollection): Promise<Collection> {
        const collectionRepo = AppDataSource.getRepository(Collection);
        const typeRepo = AppDataSource.getRepository(TechniqueType);
        const positionRepo = AppDataSource.getRepository(Position);
        const openGuardRepo = AppDataSource.getRepository(OpenGuard);

        if (!await collectionRepo.findOne({ where: { collectionId: collection.collectionId } })) {
            console.error('Collection not found when updating collection');
        }

        collection.title = collection.title;
        collection.description = collection.description;
        collection.globalNotes = collection.globalNotes ?? null;
        collection.gi = collection.gi ?? null;
        collection.hierarchy = collection.hierarchy ?? null;

        if (collection.type) {
            let type = await typeRepo.findOne({ where: { title: collection.type.title } });
            if (!type && collection.type.title && collection.type.description) {
                type = typeRepo.create({ title: collection.type.title, description: collection.type.description });
                type = await typeRepo.save(type);
            }
            collection.type = type
        } else collection.type = null;

        if (collection.position) {
            let position = await positionRepo.findOne({ where: { title: collection.position.title } });
            if (!position && collection.position.title && collection.position.description) {
                position = positionRepo.create({ title: collection.position.title, description: collection.position.description });
                await positionRepo.save(position);
            }
            collection.position = position
        } else collection.position = null;

        if (collection.openGuard) {
            let openGuard = await openGuardRepo.findOne({ where: { title: collection.openGuard.title } });
            if (!openGuard && collection.openGuard.title && collection.openGuard.description) {
                openGuard = openGuardRepo.create({ title: collection.openGuard.title, description: collection.openGuard.description });
                await openGuardRepo.save(openGuard);
            }
            collection.openGuard = openGuard
        } else collection.openGuard = null;

        return await collectionRepo.save(collection)
    };

    async deleteCollection(collectionId: string) {
        const collectionRepo = AppDataSource.getRepository(Collection);
        const collectionTechniqueRepo = AppDataSource.getRepository(CollectionTechnique)
        try {
            const collection = await collectionRepo.findOne({ where: { collectionId: collectionId } })

            if (collection) {
                await collectionTechniqueRepo.createQueryBuilder()
                    .delete()
                    .from(CollectionTechnique)
                    .where("collection = :collection", { collection: collection.collectionId })
                    .execute();
            }

            if (collection) {
                await collectionRepo.createQueryBuilder()
                    .delete()
                    .from(Collection)
                    .where("collectionId = :collectionId", { collectionId: collectionId })
                    .execute();
            }
        } catch (error) { console.error(`Error deleting collections: ${error}`) }
    }

    async getAllCollectionTitles(): Promise<Collection[]> {
        const collectionRepo = AppDataSource.getRepository(Collection);
        const collectionTitles = await collectionRepo.find({ select: ["title"] })

        return collectionTitles
    };

    async getAllCollections(): Promise<Collection[]> {
        const collectionRepo = AppDataSource.getRepository(Collection);
        const collections = await collectionRepo.find({
            relations: [
                "type",
                "position",
                "openGuard",
                "collectionTechniques",
                "collectionTechniques.technique",
                "collectionTechniques.technique.type",
                "collectionTechniques.technique.position",
                "collectionTechniques.technique.openGuard",
            ]
        })
        return collections
    };

    async getCollectionTechniques(): Promise<CollectionTechnique[]> {
        const collectionTechniqueRepo = AppDataSource.getRepository(CollectionTechnique)
        const collectionTechniques = await collectionTechniqueRepo.find({
            relations: [
                "technique",
                "technique.type",
                "technique.position",
                "technique.openGuard",
                "collection"
            ]
        });
        return collectionTechniques
    };

    async getSuggestions(): Promise<Suggestions> {
        const typeRepo = AppDataSource.getRepository(TechniqueType);
        const positionRepo = AppDataSource.getRepository(Position);
        const openGuardRepo = AppDataSource.getRepository(OpenGuard);
        const collectionRepo = AppDataSource.getRepository(Collection);

        const type = await typeRepo.find({ select: ["title"] }).then(returned => returned.map(type => type.title))
        const position = await positionRepo.find({ select: ["title"] }).then(returned => returned.map(position => position.title))
        const openguard = await openGuardRepo.find({ select: ["title"] }).then(returned => returned.map(openGuard => openGuard.title))
        const title = await collectionRepo.find({ select: ["title"] }).then(returned => returned.map(technique => technique.title))

        return {
            type, position, openguard, title, gi: ['Yes Gi', 'No Gi', 'Both'], hierarchy: ['Top', 'Bottom']
        }
    }
};
