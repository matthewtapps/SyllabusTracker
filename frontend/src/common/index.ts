import { validateStudentTechniques, validateTechniques } from './validators/Validators'
import { Collection, CollectionTechnique, CollectionWithoutTechniquesOrId, Rank, StudentTechnique, Technique, User, CollectionSet, Descriptions, Suggestions } from "./types/Types"


export type { Collection, CollectionTechnique, CollectionWithoutTechniquesOrId, Rank, StudentTechnique, Technique, User, CollectionSet, Descriptions, Suggestions }
export { validateStudentTechniques, validateTechniques }
export { Belt, Gi, Hierarchy, Permission, Role, Stripes, TechniqueStatus } from "./types/Types"
export type NewTechnique = Omit<Technique, 'techniqueId' | 'created' | 'lastUpdated'>
export type UpdateTechnique = Omit<Technique, 'created' | 'lastUpdated'>

export type NewCollection = Omit<Collection, 'collectionId' | 'created' | 'lastUpdated' | 'collectionTechniques'>
export type UpdateCollection = Omit<Collection, 'created' | 'lastUpdated' | 'collectionTechniques'>
