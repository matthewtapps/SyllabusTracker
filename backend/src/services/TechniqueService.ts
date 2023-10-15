import { Technique } from '../entities/Technique';
import { TechniqueType } from '../entities/TechniqueType';
import { Position } from '../entities/Position';
import { OpenGuard } from '../entities/OpenGuard';
import { AppDataSource } from '../data-source';

export class TechniqueService {
    async createOrUpdateTechnique(data: any): Promise<Technique> {
        const techniqueRepo = AppDataSource.getRepository(Technique);
        const typeRepo = AppDataSource.getRepository(TechniqueType);
        const positionRepo = AppDataSource.getRepository(Position);
        const openGuardRepo = AppDataSource.getRepository(OpenGuard);
      
        let type = await typeRepo.findOne({ where: { title: data.type }});
        if (!type) {
            type = typeRepo.create({ title: data.type });
            await typeRepo.save(type);
        }

        let position = await positionRepo.findOne({ where: { title: data.position }});
        if (!position) {
            position = positionRepo.create({ title: data.position });
            await positionRepo.save(position);
        }

        let openGuard = null;
        if (data.openGuard) {
            openGuard = await openGuardRepo.findOne({ where: { title: data.openGuard } });
            if (!openGuard) {
                openGuard = openGuardRepo.create({ title: data.openGuard });
                await openGuardRepo.save(openGuard);
            }
        }

        // Create or update Technique
        let technique = new Technique();
        technique.title = data.title;
        technique.videoSrc = data.videoSrc;
        technique.description = data.description;
        technique.globalNotes = data.globalNotes;
        technique.gi = data.gi;
        technique.hierarchy = data.hierarchy;
        technique._type = type;
        technique._position = position;
        technique._openGuard = openGuard;

        return await techniqueRepo.save(technique);
    } 
}
