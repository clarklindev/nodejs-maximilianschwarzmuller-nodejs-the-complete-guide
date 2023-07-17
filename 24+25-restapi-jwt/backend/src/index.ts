import express, { Express, NextFunction, Request, Response } from 'express';
import path from 'path';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

//import internal modules
import productRoutes from './routes/products';
import shopRoutes from './routes/shop';
import authRoutes from './routes/auth';
import testingRoutes from './routes/testing';

import { ErrorWithStatus } from './interface/ErrorWithStatus';

dotenv.config();

const app: Express = express();

//mongodb atlas node 2.2.12
const MONGODB_URI = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@ac-yojaa83-shard-00-00.7tcuhtv.mongodb.net:27017,ac-yojaa83-shard-00-01.7tcuhtv.mongodb.net:27017,ac-yojaa83-shard-00-02.7tcuhtv.mongodb.net:27017/?ssl=true&replicaSet=atlas-1131uo-shard-0&authSource=admin&retryWrites=true&w=majority`;

const startConnection = async () => {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: 'shop' });
    const port = process.env.PORT || 3000;
    app.listen(port);
    console.log(`listening on port ${port}...`);
  } catch (err) {
    console.log(err);
  }
};
startConnection();

app.use(express.urlencoded({ extended: false })); //handling <form> post data, "false" - parsing the URL-encoded data with the querystring librsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssary or the qs library (when true)
app.use(express.json()); //parse json application/json

app.use(cors());

app.use(express.static(path.join(__dirname, '../', 'public')));
app.use('/images', express.static(path.join(__dirname, '../', 'images')));

app.use('/products', productRoutes);
app.use('/shop', shopRoutes);
app.use('/auth', authRoutes);
app.use('/testing', testingRoutes);

// catches all errors passed with next(err);
app.use(
  (err: ErrorWithStatus, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    const status = err.statusCode || 500;
    const message = err.message;
    res.status(status).json({ message });
  }
);
