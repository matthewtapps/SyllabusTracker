import express from "express";
import cors from "cors";
import router from "./src/Router";
import { AppDataSource } from "./src/data-source";
import { auth } from 'express-oauth2-jwt-bearer';

const app = express();

const jwtCheck = auth({
    audience: 'https://syllabustracker.matthewtapps.com',
    issuerBaseURL: 'https://dev-2q58mg30s0wp6ggd.au.auth0.com/',
    tokenSigningAlg: 'RS256',
  });

// Enable cors to be able to reach the backend on localhost:3000 while running React.js in dev mode on localhost:3001
// You might want to disbale this on production.
app.use(cors());
app.use(express.json());

app.use('/api', jwtCheck, router)

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
            console.log(`Server started on http://localhost:${PORT}`);
        });
    })
    .catch(error => {
        console.log('Error initializing database:', error);
        process.exit(1);
    });
