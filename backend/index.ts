import express, {NextFunction, Request, RequestHandler, Response} from "express";
import cors from "cors";
import router from "./src/Routes";
import { User } from "./src/entities/User";
import { AppDataSource } from "./src/data-source";

const app = express();

// Enable cors to be able to reach the backend on localhost:8080 while running React.js in dev mode on localhost:3000
// You might want to disbale this on production.
app.use(cors());
app.use(express.json());

app.post('/api', router);

app.post('/user', async (req, res) => {
    const user = new User();
    user.role = req.body.role;
    user.username = req.body.username;
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.dateOfBirth = req.body.dateOfBirth;
    user.email = req.body.email;
    user.mobile = req.body.mobile;

    await AppDataSource.manager.save(user);
    res.json({ message: 'User saved!', userId: user.userId})
})

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
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
