import { Technique } from "../entities/Technique";
import { CollectionTechnique } from "../entities/CollectionTechnique";
import { Collection } from "../entities/Collection";
import { CollectionSet } from "../entities/CollectionSet";
import { AppDataSource } from "../data-source";


export class CollectionSetService {
    async setCollections(data: { collectionSetId: string, collections: Collection[] }): Promise<CollectionSet> {
        const collectionSetRepo = AppDataSource.getRepository(CollectionSet)

        const collectionSet = await collectionSetRepo.findOne({ where: { collectionSetId: data.collectionSetId } })

        if (collectionSet) {
            await collectionSetRepo.update(collectionSet.collectionSetId, {
                ...collectionSet,
                collections: data.collections
            });
        }

        return await collectionSetRepo.findOne({
            where: { collectionSetId: data.collectionSetId },
            relations: ["collections",
                "collections.collectionTechniques",
                "collections.collectionTechniques.technique",
                "collections.collectionTechniques.technique.position",
                "collections.collectionTechniques.technique.type",
                "collections.collectionTechniques.technique.openGuard",]
        })
    }

    async createCollectionSet(data: { collectionSet: Partial<CollectionSet> }): Promise<CollectionSet> {
        const collectionSetRepo = AppDataSource.getRepository(CollectionSet)

        const newSet = new CollectionSet();

        newSet.title = data.collectionSet.title
        newSet.collections = data.collectionSet.collections
        newSet.description = data.collectionSet.description

        return await collectionSetRepo.save(newSet)
    }

    async deleteCollectionSet(data: { collectionSetId: string }) {
        const collectionSetRepo = AppDataSource.getRepository(CollectionSet)

        const collectionSet = await collectionSetRepo.findOne({ where: { collectionSetId: data.collectionSetId } })

        if (collectionSet) {
            try {
                await collectionSetRepo.createQueryBuilder()
                    .delete()
                    .from(CollectionSet)
                    .where("collectionSetId = :collectionSetId", { collectionSetId: data.collectionSetId })
                    .execute()
            } catch (error) {
                console.log(error)
            }
        }
    }

    async fetchCollectionSets(): Promise<CollectionSet[]> {
        const collectionSetRepo = AppDataSource.getRepository(CollectionSet)
        return await collectionSetRepo.find({
            relations: ["collections",
                "collections.collectionTechniques",
                "collections.collectionTechniques.technique",
                "collections.collectionTechniques.technique.position",
                "collections.collectionTechniques.technique.type",
                "collections.collectionTechniques.technique.openGuard",]
        })
    }
};
