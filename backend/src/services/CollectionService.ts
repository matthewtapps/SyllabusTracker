import { TechniqueType } from '../entities/TechniqueType';
import { Position } from '../entities/Position';
import { OpenGuard } from '../entities/OpenGuard';
import { AppDataSource } from '../data-source';
import { Collection } from '../entities/Collection';
import { Technique } from '../entities/Technique';
import { CollectionTechnique } from '../entities/CollectionTechnique';
import CollectionDTO from '../dtos/CollectionDTO';
import { NewCollection, UpdateCollection } from 'common';

export class CollectionService {
    async setCollectionTechniques(data: {collectionId: string, techniques: {index: number, technique: Technique}[] }): Promise<CollectionTechnique[]> {
        const techniqueRepo = AppDataSource.getRepository(Technique);
        const collectionTechniqueRepo = AppDataSource.getRepository(CollectionTechnique)
        const collectionRepo = AppDataSource.getRepository(Collection)

        const collection = await collectionRepo.findOne({ where: { collectionId: data.collectionId} })

        if (collection) {await collectionTechniqueRepo.createQueryBuilder()
        .delete()
        .from(CollectionTechnique)
        .where("collection = :collection", { collection: collection.collectionId })
        .execute();}
        
        const collectionTechniques: CollectionTechnique[] = [];

        for (let collectionTechnique of data.techniques) {
            const techniqueToAdd = await techniqueRepo.findOne({ where: { techniqueId: collectionTechnique.technique.techniqueId }})
            if (!techniqueToAdd) {
                throw new Error(`Technique with id ${collectionTechnique.technique.techniqueId} not found in technique repo.`);
            }

            const newCollectionTechnique = new CollectionTechnique();
            newCollectionTechnique.technique = techniqueToAdd;
            newCollectionTechnique.order = collectionTechnique.index;
            newCollectionTechnique.collection = collection
            
            collectionTechniques.push(newCollectionTechnique)
        };

        return await collectionTechniqueRepo.save(collectionTechniques);
    }

    async createCollection(data: {collection: NewCollection}): Promise<Collection> {
        const collectionRepo = AppDataSource.getRepository(Collection);
        const typeRepo = AppDataSource.getRepository(TechniqueType);
        const positionRepo = AppDataSource.getRepository(Position);
        const openGuardRepo = AppDataSource.getRepository(OpenGuard);

        let collection = new Collection();

        collection.title = data.collection.title;
        collection.description = data.collection.description;
        collection.globalNotes = data.collection.globalNotes ?? null;
        collection.gi = data.collection.gi ?? null;
        collection.hierarchy = data.collection.hierarchy ?? null;

        if (data.collection.type) {
            let type = await typeRepo.findOne({ where: { title: data.collection.type.title }});
            collection.type = type;
        } else collection.type = null;

        if (data.collection.position) {
            let position = await positionRepo.findOne({ where: { title: data.collection.position.title }});
            collection.position = position;
        } else collection.position = null;

        if (data.collection.openGuard) {
            let openGuard = await openGuardRepo.findOne({ where: { title: data.collection.openGuard.title } });
            collection.openGuard = openGuard
        } else collection.openGuard = null;

        return await collectionRepo.save(collection)        
    };

    async updateCollection(data: {collection: UpdateCollection}): Promise<Collection> {
        const collectionRepo = AppDataSource.getRepository(Collection);
        const typeRepo = AppDataSource.getRepository(TechniqueType);
        const positionRepo = AppDataSource.getRepository(Position);
        const openGuardRepo = AppDataSource.getRepository(OpenGuard);

        let collection = await collectionRepo.findOne({ where: { collectionId: data.collection.collectionId } });
        if (!collection) {
            throw new Error('Collection not found');
        }

        collection.title = data.collection.title;
        collection.description = data.collection.description;
        collection.globalNotes = data.collection.globalNotes ?? null;
        collection.gi = data.collection.gi ?? null;
        collection.hierarchy = data.collection.hierarchy ?? null;

        if (data.collection.type) {
            let type = await typeRepo.findOne({ where: { title: data.collection.type.title }});
            if (!type && data.collection.type.title && data.collection.type.description) {
                type = typeRepo.create({ title: data.collection.type.title, description: data.collection.type.description });
                await typeRepo.save(type);
            }
        } else collection.type = null;

        if (data.collection.position) {
            let position = await positionRepo.findOne({ where: { title: data.collection.position.title }});
            if (!position&& data.collection.position.title && data.collection.position.description) {
                position = positionRepo.create({ title: data.collection.position.title, description: data.collection.position.description });
                await positionRepo.save(position);
            }
        } else collection.position = null;

        if (data.collection.openGuard) {
            let openGuard = null
            if (data.collection.openGuard) {
                openGuard = await openGuardRepo.findOne({ where: { title: data.collection.openGuard.title } });
                if (!openGuard && data.collection.openGuard.title && data.collection.openGuard.description) {
                    if (!openGuard && data.collection.openGuard.title) {
                        openGuard = openGuardRepo.create({ title: data.collection.openGuard.title, description: data.collection.openGuard.description });
                        await openGuardRepo.save(openGuard);
                    }
                }
            }
        } else collection.openGuard = null;

        return await collectionRepo.save(collection)        
    };

    async deleteCollection(data: {collectionId: string}) {
        const collectionRepo = AppDataSource.getRepository(Collection);
        const collectionTechniqueRepo = AppDataSource.getRepository(CollectionTechnique)

        const collection = await collectionRepo.findOne({ where: { collectionId: data.collectionId} })

        if (collection) {await collectionTechniqueRepo.createQueryBuilder()
            .delete()
            .from(CollectionTechnique)
            .where("collection = :collection", { collection: collection.collectionId })
            .execute();}

        if (collection) {await collectionRepo.createQueryBuilder()
            .delete()
            .from(Collection)
            .where("collectionId = :collectionId", { collectionId: data.collectionId })
            .execute();}
    }

    async getAllCollectionTitles(): Promise<Collection[]> {
        const collectionRepo = AppDataSource.getRepository(Collection);
        const collectionTitles = await collectionRepo.find({ select: ["title"]})

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
};
