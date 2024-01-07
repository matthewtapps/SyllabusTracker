import express from "express";
import cors from "cors";
import router from "./src/Router";
import { AppDataSource } from "./src/data-source";
import { auth } from 'express-oauth2-jwt-bearer';
import morgan from 'morgan';
import 'dotenv/config';

const app = express();
app.use(cors())

const jwtAudience = process.env.JWT_AUDIENCE
const issuerBaseURL = process.env.ISSUER_BASE_URL

const jwtCheck = auth({
    audience: jwtAudience,
    issuerBaseURL: issuerBaseURL,
    tokenSigningAlg: 'RS256',
  });

app.use(express.json());
app.use(morgan('combined', {immediate: true}));
app.use('/api', jwtCheck, router);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(req.headers.authorization)
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 3000;
AppDataSource.initialize()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    })
    .catch(error => {
        console.log('Error initializing database:', error);
        process.exit(1);
    });
