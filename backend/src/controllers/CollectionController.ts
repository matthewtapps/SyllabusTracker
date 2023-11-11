import { Request, Response } from 'express';
import { CollectionService } from '../services/CollectionService';

export class CollectionController {
    static async createNewCollection(req: Request, res: Response) {
        const collectionService = new CollectionService();
        try {
            const collection = await collectionService.createNewCollection(req.body);
            res.json(collection);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async setCollectionTechniques(req: Request, res: Response) {
        const collectionService = new CollectionService()
        try {
            const collectionTechniques = await collectionService.setCollectionTechniques(req.body);
            res.json(collectionTechniques);
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    }

    static async getAllCollections(req: Request, res: Response) {
        const collectionService = new CollectionService();
        try {
            const collections = await collectionService.getAllCollections();
            res.json(collections);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getAllCollectionTitles(req: Request, res: Response) {
        const collectionService = new CollectionService();
        try {
            const collectionTitles = await collectionService.getAllCollectionTitles();
            res.json(collectionTitles);
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    }
}
