const mongodb = require('mongodb');
const { getDb } = require('../utils/database');

class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId; //connects to user via userId
  }
  async save() {
    const db = getDb();
    let result;
    //edit mode
    if (this._id) {
      result = await db
        .collection('products')
        .updateOne({ _id: this._id }, { $set: this }); // { $set: this } describes the changes we want to make
    }
    //create mode
    else {
      result = await db.collection('products').insertOne(this);
    }
    console.log('result: ', result);
    return result;
  }

  static async fetchAll() {
    try {
      const db = getDb();
      //find returns a cursor( which allows going through document/elements step-by-step) - which you can convert to an array
      const products = await db.collection('products').find().toArray();
      console.log('products: ', products);
      return products;
    } catch (err) {
      console.log(err);
    }
  }

  static async findById(productId) {
    try {
      const db = getDb();
      const query = { _id: new mongodb.ObjectId(productId) };
      const product = await db.collection('products').findOne(query);
      console.log('product: ', product);
      return product;
    } catch (err) {
      console.log(err);
    }
  }

  static async deleteById(productId) {
    try {
      const db = getDb();
      const query = { _id: new mongodb.ObjectId(productId) };
      const result = await db.collection('products').deleteOne(query);
      console.log('result: ', result);
      return result;
    } catch (err) {
      console.log(err);
    }
  }
}
module.exports = Product;
