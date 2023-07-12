import express, { Express, NextFunction, Request, Response } from 'express';
import path from 'path';
import mongoose from 'mongoose';
import session from 'express-session';

import MongoDBStore from 'connect-mongodb-session';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from "dotenv";
dotenv.config();

import User from './models/user';

import adminRoutes from './routes/admin';
import shopRoutes from './routes/shop';
import authRoutes from './routes/auth';

const app:Express = express();
//mongodb atlas node 5.5 - hit or miss
//const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.7tcuhtv.mongodb.net/?retryWrites=true&w=majority`;

//mongodb atlas node 2.2.12
const MONGODB_URI = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@ac-yojaa83-shard-00-00.7tcuhtv.mongodb.net:27017,ac-yojaa83-shard-00-01.7tcuhtv.mongodb.net:27017,ac-yojaa83-shard-00-02.7tcuhtv.mongodb.net:27017/?ssl=true&replicaSet=atlas-1131uo-shard-0&authSource=admin&retryWrites=true&w=majority`;

const store = new (MongoDBStore(session))({
  uri: MONGODB_URI,
  collection: 'sessions',
  databaseName: 'auth',
});

app.use(bodyParser.urlencoded({ extended: false })); //handling <form> post data, "false" - parsing the URL-encoded data with the querystring library or the qs library (when true)
app.use(bodyParser.json()); //parse json application/json
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

//session cookie dies with page load
app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  store: store,
}));


//check for req.session.user 
//allow access to .user via http req headers by adding user directly to request (req.user) as opposed access via: req.session.user
app.use( async (req:Request, res:Response, next:NextFunction) => {

  //if .user doesnt exist on .session ie. not logged in
  if(!req.session.user){
    return next();    
  }

  const user = await User.findById( req.session.user._id );

  //add user to req. header
  req.user = user;
  next();
});

app.use('/admin', adminRoutes);
app.use('/shop', shopRoutes);
app.use('/auth', authRoutes);

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
