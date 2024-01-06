import { Request, Response } from "express";
import { CollectionSetService } from "../services/CollectionSetService";


export class CollectionSetController {
    static async createCollectionSet(req: Request, res: Response) {
        const collectionSetService = new CollectionSetService();
        try {
            const collectionSet = await collectionSetService.createCollectionSet(req.body);
            res.json(collectionSet);
        } catch (error) {
            res.status(400).json({ error: error.message });
            console.log(error)
        }
    }

    static async setCollections(req: Request, res: Response) {
        const collectionSetService = new CollectionSetService()
        const collectionSetId = req.params.collectionSetId
        try {
            const collectionSet = await collectionSetService.setCollections(collectionSetId, req.body);
            res.json(collectionSet);
        } catch (error) {
            res.status(400).json({ error: error.message })
            console.log(error)
        }
    }

    static async deleteCollectionSet(req: Request, res: Response) {
        const collectionSetService = new CollectionSetService()
        try {
            const collectionSetId = req.params.collectionSetId
            await collectionSetService.deleteCollectionSet(collectionSetId)
            res.status(200).json({ message: 'Collection set deleted successfully' });
        } catch (error) {
            res.status(400).json({error: error.message})
            console.log(error)
        }
    }

    static async getCollectionSets(req: Request, res: Response) {
        const collectionSetService = new CollectionSetService()
        try {
            const collectionSets = await collectionSetService.fetchCollectionSets()
            res.status(200).json(collectionSets)
        } catch (error) {
            res.status(400).json({error: error.message})
            console.log(error)
        }
    }
};
