import * as fs from 'fs';
import { validateTechniques } from '../../shared/validators/validateGlobalTechniques';
import { Technique } from '../../shared/types/Technique';

let techniquesPath = "./data/techniques.json";

export function retrieveGlobalTechniques(): Technique[] {
    return validateTechniques(JSON.parse(fs.readFileSync(techniquesPath, 'utf8')).techniques)
}
