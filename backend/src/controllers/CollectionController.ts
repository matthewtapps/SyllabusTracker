import { Request, Response } from 'express';
import { CollectionService } from '../services/CollectionService';

export class CollectionController {
    static async createCollection(req: Request, res: Response) {
        const collectionService = new CollectionService();
        console.log(req.body)
        try {
            const collection = await collectionService.createCollection(req.body);
            res.json(collection);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async updateCollection(req: Request, res: Response) {
        const collectionService = new CollectionService();
        try {
            const collection = await collectionService.updateCollection(req.body);
            res.json(collection);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async setCollectionTechniques(req: Request, res: Response) {
        const collectionService = new CollectionService()
        const collectionId = req.params.collectionId
        try {
            const collectionTechniques = await collectionService.setCollectionTechniques(collectionId, req.body);
            res.json(collectionTechniques);
        } catch (error) {
            res.status(400).json({ error: error.message })
            console.log(error)
        }
    }

    static async deleteCollection(req: Request, res: Response) {
        const collectionService = new CollectionService()
        const collectionId = req.params.collectionId
        try {
            await collectionService.deleteCollection(collectionId)
            res.status(200).json({ message: 'Collection deleted successfully' });
        } catch (error) {
            res.status(400).json({error: error.message})
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

    static async getCollectionTechniques(req: Request, res: Response) {
        const collectionService = new CollectionService();
        try {
            const collectionTechniques = await collectionService.getCollectionTechniques();
            res.json(collectionTechniques);
        } catch (error) {
            res.status(400).json({error: error.message})
        }
    }

    static async getSuggestions(req: Request, res: Response) {
        const collectionService = new CollectionService();
        try {
            const suggestions = await collectionService.getSuggestions();
            res.status(200).json(suggestions)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    }

}
