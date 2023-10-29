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
    async addTechniquesToCollection(data: CollectionTechniqueDTO): Promise<CollectionTechnique[]> {
        const techniqueRepo = AppDataSource.getRepository(Technique);
        const collectionTechniqueRepo = AppDataSource.getRepository(CollectionTechnique)
        const collectionRepo = AppDataSource.getRepository(Collection)

        const collectionTechniques: CollectionTechnique[] = [];

        const collection = await collectionRepo.findOne({ where: { collectionId: data.collection.collectionId} })
        
        for (const collectionTechnique of data.techniques) {
            const techniqueToAdd = await techniqueRepo.findOne({ where: { techniqueId: collectionTechnique.technique.techniqueId }})
            if (!techniqueToAdd) {
                throw new Error(`Technique with id ${collectionTechnique.technique.techniqueId} not found in technique repo.`);
            }

            

            const newCollectionTechnique = new CollectionTechnique();
            newCollectionTechnique.technique = techniqueToAdd;
            newCollectionTechnique.order = collectionTechnique.index + 1;
            newCollectionTechnique.collection = collection
            
            collectionTechniques.push(newCollectionTechnique)
        };

        return await collectionTechniqueRepo.save(collectionTechniques);
    }

    async createNewCollection(data: CollectionDTO): Promise<Collection> {
        const collectionRepo = AppDataSource.getRepository(Collection);
        const typeRepo = AppDataSource.getRepository(TechniqueType);
        const positionRepo = AppDataSource.getRepository(Position);
        const openGuardRepo = AppDataSource.getRepository(OpenGuard);

        let collection = new Collection();
        collection.title = data.title;
        collection.description = data.description;
        collection.globalNotes = data.globalNotes ?? null;
        collection.gi = data.gi ?? null;
        collection.hierarchy = data.hierarchy ?? null;

        if (data.type) {
            let type = await typeRepo.findOne({ where: { title: data.type }});
            collection.type = type;
        } else collection.type = null;

        if (data.position) {
            let position = await positionRepo.findOne({ where: { title: data.position }});
            collection.position = position;
        } else collection.position = null;

        if (data.openGuard) {
            let openGuard = await openGuardRepo.findOne({ where: { title: data.openGuard } });
            collection.openGuard = openGuard
        } else collection.openGuard = null;

        return await collectionRepo.save(collection)        
    };

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
};
