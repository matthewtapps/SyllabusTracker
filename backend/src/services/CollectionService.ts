import { TechniqueType } from '../entities/TechniqueType';
import { Position } from '../entities/Position';
import { OpenGuard } from '../entities/OpenGuard';
import { AppDataSource } from '../data-source';
import { Collection } from '../entities/Collection';
import { Technique } from '../entities/Technique';
import { CollectionTechnique } from '../entities/CollectionTechnique';
import CollectionDTO from '../dtos/CollectionDTO';
import CollectionTechniqueDTO from '../dtos/CollectionTechniqueDTO';

export class CollectionService {
    async setCollectionTechniques(data: CollectionTechniqueDTO): Promise<CollectionTechnique[]> {
        const techniqueRepo = AppDataSource.getRepository(Technique);
        const collectionTechniqueRepo = AppDataSource.getRepository(CollectionTechnique)
        const collectionRepo = AppDataSource.getRepository(Collection)

        const collection = await collectionRepo.findOne({ where: { collectionId: data.collection.collectionId} })

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

    async createOrUpdateCollection(data: {collectionId: string, collection: CollectionDTO}): Promise<Collection> {
        const collectionRepo = AppDataSource.getRepository(Collection);
        const typeRepo = AppDataSource.getRepository(TechniqueType);
        const positionRepo = AppDataSource.getRepository(Position);
        const openGuardRepo = AppDataSource.getRepository(OpenGuard);

        let collection = await collectionRepo.findOne({ where: { collectionId: data.collectionId }});
        if (!collection) collection = new Collection();

        collection.title = data.collection.title;
        collection.description = data.collection.description;
        collection.globalNotes = data.collection.globalNotes ?? null;
        collection.gi = data.collection.gi ?? null;
        collection.hierarchy = data.collection.hierarchy ?? null;

        if (data.collection.type) {
            let type = await typeRepo.findOne({ where: { title: data.collection.type }});
            collection.type = type;
        } else collection.type = null;

        if (data.collection.position) {
            let position = await positionRepo.findOne({ where: { title: data.collection.position }});
            collection.position = position;
        } else collection.position = null;

        if (data.collection.openGuard) {
            let openGuard = await openGuardRepo.findOne({ where: { title: data.collection.openGuard } });
            collection.openGuard = openGuard
        } else collection.openGuard = null;

        return await collectionRepo.save(collection)        
    };

    async deleteCollection(data: {collectionId: string}) {
        const collectionRepo = AppDataSource.getRepository(Collection);

        const collection = await collectionRepo.findOne({ where: { collectionId: data.collectionId} })

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
