import * as fs from 'fs';
import { validateTechniques } from '../validators/validateGlobalTechniques';
import { Technique } from '../types/Technique';

let techniquesPath = "./data/techniques.json";

export function retrieveGlobalTechniques(): Technique[] {
    return validateTechniques(JSON.parse(fs.readFileSync(techniquesPath, 'utf8')).techniques)
}
