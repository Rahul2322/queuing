import express, { Application, NextFunction, Request, Response } from 'express';
import {config} from 'dotenv'
import { dbConnection } from './config/db';
import routes from './routes'
import { errorMiddleware } from './middleware/errorMiddleware';
import ErrorHandler from './utils/utility-class';
import { queue } from './cron/fetchUserInBatch';



config()

const port = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI as string;

dbConnection(mongoURI);

const app:Application = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

queue.add(
    "fetch-users",
    {
      repeat: { every: 1000 * 60 * 60 },
    }
  );



app.use('/api',routes);


app.use((err:ErrorHandler,req:Request,res:Response,next:NextFunction)=>{
    errorMiddleware(err,req,res,next)
})

app.listen(port,()=>{
    console.log(`Listening on port ${port}`)
})




