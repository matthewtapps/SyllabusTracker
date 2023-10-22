import * as fs from 'fs';
import { validateTechniques } from 'common';
import { Technique } from 'common';

let techniquesPath = "./dummy_data/techniques.json";

export function retrieveGlobalTechniques(): Technique[] {
    return validateTechniques(JSON.parse(fs.readFileSync(techniquesPath, 'utf8')).techniques)
}
