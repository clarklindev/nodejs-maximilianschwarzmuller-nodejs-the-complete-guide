const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = async () => {
  try {
    const mongodbConnection = await MongoClient.connect(
      `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.g7sijtf.mongodb.net/?retryWrites=true&w=majority`
    );
    return mongodbConnection;
  } catch (err) {
    console.log(err);
  }
};

module.exports = mongoConnect;
