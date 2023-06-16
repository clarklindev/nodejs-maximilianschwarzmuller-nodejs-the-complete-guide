const getDb = require('../utils/database').getDb;
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;

class User {
  constructor(username, email, cart = { items: [] }, id) {
    this.name = username;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection('users').insertOne(this);
  }

  //the User collection only stores references of product and quantity, but we need to get the detailed Product
  async getCart() {
    const db = getDb();

    //get just the productIds of items in the cart
    const productIds = this.cart.items.map((i) => {
      return i.productId;
    });

    //find (products of Product) in cart using productIds
    const productsInCart = await db
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray(); //search products with these ids - returns array of cursors

    //use product collection data, in add quantity back to product
    const productsInCartWithQuantity = productsInCart.map((p) => {
      return {
        ...p,
        quantity: this.cart.items.find((i) => {
          return i.productId.toString() === p._id.toString();
        }).quantity,
      };
    });

    return productsInCartWithQuantity;
  }

  //this is called when you submit your cart
  //you add whats in cart to orders and reset cart.
  async addOrder() {
    const db = getDb();
    const products = await this.getCart();
    const order = {
      items: products,
      user: {
        _id: new ObjectId(this._id),
        name: this.name,
      },
    };
    await db.collection('orders').insertOne(order);
    this.cart = { items: [] }; //clear cart

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(this._id) },
      { $set: { cart: { items: [] } } } //replace cart
    );
    return result;
  }

  async getOrders() {
    const db = getDb();
    return db
      .collection('orders')
      .find({ 'user._id': new ObjectId(this._id) }) //find in orders collection where a user's id is same as this._id
      .toArray();
  }

  //update user's cart
  addToCart(product) {
    //check if it exists in cart
    const cartProductIndex =
      this.cart?.items?.findIndex((cartProduct) => {
        return cartProduct.productId.toString() === product._id.toString();
      }) ?? -1;

    let newQuantity = 1;
    const updatedCartItems = this.cart?.items ? [...this.cart.items] : [];

    if (cartProductIndex >= 0) {
      //already exists
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      //structure of cart items
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity,
      });
    }

    //this is the structure of the cart
    //updated cart (with quantity)
    const updatedCart = {
      items: updatedCartItems,
    };

    const db = getDb();
    return db.collection('users').updateOne(
      { _id: new ObjectId(this._id) },
      { $set: { cart: updatedCart } } //replace cart
    );
  }

  static findById = (userId) => {
    const db = getDb();
    return db.collection('users').findOne({ _id: new ObjectId(userId) });
  };

  async deleteFromCart(productId) {
    const updatedCartItems = this.cart.items.filter((item) => {
      const a = item.productId.toString();
      const b = productId.toString();
      return a !== b;
    });

    const db = getDb();
    return await db.collection('users').updateOne(
      { _id: new ObjectId(this._id) },
      { $set: { cart: { items: updatedCartItems } } } //replace cart
    );
  }
}

module.exports = User;
