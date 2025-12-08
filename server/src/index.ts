import express, { Request, Response } from 'express';
import userRoutes from './routes/user-routes';

const app: express.Application = express();

const port: number = 3000;

app.get('/', (req: Request, res: Response) => {
    res.send("TypeScript With Express");
});

app.use(express.json());
app.use('/users', userRoutes);

app.listen(port, () => {
    console.log(`TypeScript with Express 
         http://localhost:${port}/`);
});

//npm start to start the server
//http://localhost:3000/
