import { Technique } from "../src/entities/Technique"
import { Collection } from "../src/entities/Collection"
import { StudentTechnique } from "../src/entities/StudentTechnique"
import { CollectionTechnique } from "../src/entities/CollectionTechnique"
import { CollectionSet } from "../src/entities/CollectionSet"
import { AppDataSource } from "../src/data-source"
import { OpenGuard } from "../src/entities/OpenGuard"
import { Position } from "../src/entities/Position"
import { TechniqueType } from "../src/entities/TechniqueType"

export async function matchesLastUpdated(data: { table: string, datetime: Date }): Promise<boolean> {
    let dateMatches = false
    switch (data.table) {
        case "technique":
            const techniqueRepo = AppDataSource.getRepository(Technique)
            const latestTechnique = await techniqueRepo.findOne({
                order: {
                    lastUpdated: "DESC"
                }
            });
            if (latestTechnique) {
                dateMatches = latestTechnique.lastUpdated.getTime() === data.datetime.getTime();
            }

        case "collection":
            const collectionRepo = AppDataSource.getRepository(Collection)
            const latestCollection = await collectionRepo.findOne({
                order: {
                    lastUpdated: "DESC"
                }
            });

            if (latestCollection) {
                dateMatches = latestCollection.lastUpdated.getTime() === data.datetime.getTime();
            }

        case "studentTechnique":
            const studentTechniqueRepo = AppDataSource.getRepository(StudentTechnique)
            const latestStudentTechnique = await studentTechniqueRepo.findOne({
                order: {
                    lastUpdated: "DESC"
                }
            });

            if (latestStudentTechnique) {
                dateMatches = latestStudentTechnique.lastUpdated.getTime() === data.datetime.getTime();
            }

        case "collectionTechnique":
            const collectionTechniqueRepo = AppDataSource.getRepository(CollectionTechnique)
            const latestCollectionTechnique = await collectionTechniqueRepo.findOne({
                order: {
                    lastUpdated: "DESC"
                }
            });

            if (latestCollectionTechnique) {
                dateMatches = latestCollectionTechnique.lastUpdated.getTime() === data.datetime.getTime();
            }

        case "collectionSet":
            const collectionSetRepo = AppDataSource.getRepository(CollectionSet)
            const latestCollectionSet = await collectionSetRepo.findOne({
                order: {
                    lastUpdated: "DESC"
                }
            });

            if (latestCollectionSet) {
                dateMatches = latestCollectionSet.lastUpdated.getTime() === data.datetime.getTime();
            }

        case "openGuard":
            const openGuardRepo = AppDataSource.getRepository(OpenGuard)
            const latestOpenGuard = await openGuardRepo.findOne({
                order: {
                    lastUpdated: "DESC"
                }
            });

            if (latestOpenGuard) {
                dateMatches = latestOpenGuard.lastUpdated.getTime() === data.datetime.getTime();
            }

        case "position":
            const positionRepo = AppDataSource.getRepository(Position)
            const latestPosition = await positionRepo.findOne({
                order: {
                    lastUpdated: "DESC"
                }
            });

            if (latestPosition) {
                dateMatches = latestPosition.lastUpdated.getTime() === data.datetime.getTime();
            }

        case "type":
            const typeRepo = AppDataSource.getRepository(TechniqueType)
            const latestType = await typeRepo.findOne({
                order: {
                    lastUpdated: "DESC"
                }
            });

            if (latestType) {
                dateMatches = latestType.lastUpdated.getTime() === data.datetime.getTime();
            }
    };

    return dateMatches
}