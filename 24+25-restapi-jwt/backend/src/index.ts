import express, { Express, NextFunction, Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import productRoutes from './apis/products/routes';
import shopRoutes from './apis/shop/routes';
import authRoutes from './apis/auth/routes';
import contactRoutes from './apis/contacts/routes';
import { IError } from './lib/interfaces/IError';
import { jsonApiErrorResponseFromError } from './lib/helpers/jsonApiErrorResponseFromError';
import { initMulter } from './lib/middleware/initMulter';
import { initDatabase } from './lib/middleware/initDatabase';

//enable environment variables
dotenv.config();

const app: Express = express();

//connect to database
const MONGODB_URI = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@ac-yojaa83-shard-00-00.7tcuhtv.mongodb.net:27017,ac-yojaa83-shard-00-01.7tcuhtv.mongodb.net:27017,ac-yojaa83-shard-00-02.7tcuhtv.mongodb.net:27017/?ssl=true&replicaSet=atlas-1131uo-shard-0&authSource=admin&retryWrites=true&w=majority`;
const databaseName = 'shop';
app.use(initDatabase(MONGODB_URI, databaseName));

//start express server
try {
  const port = process.env.PORT || 3000;
  app.listen(port);
  console.log(`server running at ${process.env.URL}:${port}`);
} catch (err) {
  const error: IError = new Error('Failed to start server');
  error.statusCode = 500;
  throw error;
}

const corsOptions = {
  origin: `${process.env.FRONTEND_URL}:${process.env.FRONTEND_PORT}`, // Replace with your frontend URL
};
//cors order important: needs to come before express.json()
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false })); //handling <form> post data, "false" - parsing the URL-encoded data with the querystring library or the qs library (when true)
app.use(express.json()); //parse json application/json
app.use(express.json({ type: 'application/vnd.api+json' })); // Middleware to parse incoming JSON data with JSON API content type

//static file handling
app.use(express.static(path.join(__dirname, '../', 'public')));
app.use('/images', express.static(path.join(__dirname, '../', 'images'))); //serving files as if from root folder but we need /images says we are looking in /images on root

//multer (multipart form-handling related)
//initMulter(folder, inputFieldName)
//props: folder - folder to store files being uploaded (relative to root folder)
//props: inputFieldName - name of the input on the form that is handling the file upload
app.use(initMulter('images', 'upload'));

// routes
app.use('/auth', authRoutes);
app.use('/contacts', contactRoutes);
app.use('/products', productRoutes);
app.use('/shop', shopRoutes);

//handle all misc routes
app.use((req, res) => {
  res.status(404).json({ status: 'ERROR', message: 'Page Not Found' });
});

// catches all errors passed with next(err);
//note you need to include "next:NextFunction" prop as its part of the middleware error handler function prop signature
app.use((err: IError, req: Request, res: Response, next: NextFunction) => {
  const formattedResponse = jsonApiErrorResponseFromError(err);
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json(formattedResponse);
});
