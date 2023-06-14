const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = async () => {
  try {
    const client = await MongoClient.connect(
      `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.g7sijtf.mongodb.net/?retryWrites=true&w=majority`
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
