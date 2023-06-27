const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = async () => {
  console.log('connecting...');
  try {
    const client = await MongoClient.connect(
      // HIT or MISS... mongodb using version 5.5
      // `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.7tcuhtv.mongodb.net/?retryWrites=true&w=majority`

      // use 2.2.12
      `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@ac-yojaa83-shard-00-00.7tcuhtv.mongodb.net:27017,ac-yojaa83-shard-00-01.7tcuhtv.mongodb.net:27017,ac-yojaa83-shard-00-02.7tcuhtv.mongodb.net:27017/?ssl=true&replicaSet=atlas-1131uo-shard-0&authSource=admin&retryWrites=true&w=majority`,
      {}
    );

    _db = client.db('shop'); //connects to whatever the db name is,
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'no database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
