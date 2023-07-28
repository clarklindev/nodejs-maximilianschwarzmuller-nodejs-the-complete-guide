import express, { Express, NextFunction, Request, Response } from 'express';
import path from 'path';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import cookieParser from 'cookie-parser';

//import internal modules
import productRoutes from './routes/products';
import shopRoutes from './routes/shop';
import authRoutes from './routes/auth';
import testingRoutes from './routes/testing';
import DateHelper from './global/helpers/DateHelper';

import { ErrorWithStatus } from './global/interfaces/ErrorWithStatus';

dotenv.config();

const app: Express = express();

//mongodb atlas node 2.2.12
const MONGODB_URI = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@ac-yojaa83-shard-00-00.7tcuhtv.mongodb.net:27017,ac-yojaa83-shard-00-01.7tcuhtv.mongodb.net:27017,ac-yojaa83-shard-00-02.7tcuhtv.mongodb.net:27017/?ssl=true&replicaSet=atlas-1131uo-shard-0&authSource=admin&retryWrites=true&w=majority`;

const fileStorage = multer.diskStorage({
  //call callback once done with set up, 1st param pass null - no error
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  //call callback once done with set up, 1st param pass null - no error
  filename: (req, file, cb) => {
    cb(
      null,
      DateHelper.filenameFriendlyDate(new Date()) + '__' + file.originalname //create unique filename
    ); //file.filename is the new name multer gives
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    // error, store
    cb(null, true);
  } else {
    // error, do not store
    cb(null, false);
  }
};

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

// Enable CORS for specific origins with credentials
const corsOptions = {
  origin: 'http://localhost:5173', // Replace with your frontend URL
  credentials: true,
};

//order important needs to come before express.json()
app.use(cors(corsOptions));
app.use(cookieParser());

app.use(express.urlencoded({ extended: false })); //handling <form> post data, "false" - parsing the URL-encoded data with the querystring library or the qs library (when true)
app.use(express.json()); //parse json application/json

// Middleware to parse incoming JSON data with JSON API content type
app.use(express.json({ type: 'application/vnd.api+json' }));

app.use(
  multer({
    storage: fileStorage,
    fileFilter,
  }).single('upload') //the param passed to single() is the same as the input name in the form
);

app.use(express.static(path.join(__dirname, '../', 'public')));
app.use('/images', express.static(path.join(__dirname, '../', 'images'))); //serving files as if from root folder but we need /images says we are looking in /images on root

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
