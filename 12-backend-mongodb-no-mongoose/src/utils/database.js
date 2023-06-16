const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = async () => {
  console.log('connecting...');
  try {
    const client = await MongoClient.connect(
      // hit-or-miss node5.5//`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.g7sijtf.mongodb.net/?retryWrites=true&w=majority`
      `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@ac-one7kcu-shard-00-00.g7sijtf.mongodb.net:27017,ac-one7kcu-shard-00-01.g7sijtf.mongodb.net:27017,ac-one7kcu-shard-00-02.g7sijtf.mongodb.net:27017/?ssl=true&replicaSet=atlas-edr9tf-shard-0&authSource=admin&retryWrites=true&w=majority`
    );

    _db = client.db(); //connects to whatever the db name is,
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
