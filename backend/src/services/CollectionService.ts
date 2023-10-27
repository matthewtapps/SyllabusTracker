import { TechniqueType } from '../entities/TechniqueType';
import { Position } from '../entities/Position';
import { OpenGuard } from '../entities/OpenGuard';
import { AppDataSource } from '../data-source';
import { Collection } from '../entities/Collection';
import { Technique } from '../entities/Technique';
import { CollectionTechnique } from '../entities/CollectionTechnique';

export class CollectionService {
    async addTechniquesToCollection(data: any): Promise<CollectionTechnique[]> {
        const techniqueRepo = AppDataSource.getRepository(Technique);
        const collectionTechniqueRepo = AppDataSource.getRepository(CollectionTechnique)

        const collectionTechniques: CollectionTechnique[] = [];
        
        for (const technique of data.collectionTechniques) {
            const techniqueId = technique.techniqueId
            const techniqueToAdd = await techniqueRepo.findOne(techniqueId)
            if (!techniqueToAdd) {
                throw new Error(`Technique with id ${techniqueId} not found.`);
            }

            const collectionTechnique = new CollectionTechnique();
            data.module = module;
            collectionTechnique.technique = techniqueToAdd;
            collectionTechnique.order = technique.order + 1;
            
            collectionTechniques.push(collectionTechnique)
        };

        return await collectionTechniqueRepo.save(collectionTechniques);
    }

    async createNewCollection(data: any): Promise<Collection> {
        const collectionRepo = AppDataSource.getRepository(Collection);
        const typeRepo = AppDataSource.getRepository(TechniqueType);
        const positionRepo = AppDataSource.getRepository(Position);
        const openGuardRepo = AppDataSource.getRepository(OpenGuard);

        let collection = new Collection();
        collection.title = data.title;
        collection.description = data.description;
        collection.globalNotes = data.globalNotes;
        collection.gi = data.gi;
        collection.hierarchy = data.hierarchy;

        if (data.type) {
            let type = await typeRepo.findOne({ where: { title: data.type }});
            collection.type = type;
        }

        if (data.position) {
            let position = await positionRepo.findOne({ where: { title: data.position }});
            collection.position = position;
        }

        if (data.openGuard) {
            let openGuard = await openGuardRepo.findOne({ where: { title: data.openGuard } });
            collection.openGuard = openGuard
        }

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
            relations: ["type", "position", "openGuard", "techniques"]
        })

        return collections
    };
};
