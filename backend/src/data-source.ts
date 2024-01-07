import "reflect-metadata"
import { DataSource } from "typeorm"
import { Technique } from "./entities/Technique"
import { OpenGuard } from "./entities/OpenGuard"
import { Position } from "./entities/Position"
import { StudentTechnique } from "./entities/StudentTechnique"
import { TechniqueType } from "./entities/TechniqueType"
import { Collection } from "./entities/Collection"
import { CollectionTechnique } from "./entities/CollectionTechnique"
import { CollectionSet } from "./entities/CollectionSet"
import 'dotenv/config';


const postgresUser = process.env.RDS_USERNAME
const postgresPass = process.env.RDS_PASSWORD
const postgresHostname = process.env.RDS_HOSTNAME
const postgresDB = process.env.RDS_DB_NAME

export const AppDataSource = new DataSource({
    type: "postgres",
    host: postgresHostname,
    port: 5432,
    username: postgresUser,
    password: postgresPass,
    database: postgresDB,
    synchronize: true,
    logging: false,
    entities: [
        Technique, 
        OpenGuard, 
        Position, 
        StudentTechnique, 
        Technique, 
        TechniqueType,
        Collection,
        CollectionTechnique,
        CollectionSet    
    ],
    migrations: [],
    subscribers: [],
})

const initializeDataSource = async () => {
    await AppDataSource.initialize();
};

initializeDataSource().catch(err => {
    console.log(postgresUser, postgresHostname, postgresPass, postgresDB)
    console.error(err);
    process.exit(1);
});
