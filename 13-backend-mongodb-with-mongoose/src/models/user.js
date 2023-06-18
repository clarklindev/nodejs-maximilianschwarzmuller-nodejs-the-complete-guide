const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});
userSchema.methods.addToCart = function (product) {
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
      productId: product._id,
      quantity: newQuantity,
    });
  }

  const updatedCart = {
    items: updatedCartItems,
  };

  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.deleteFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter((item) => {
    const a = item.productId.toString();
    const b = productId.toString();
    return a !== b;
  });

  this.cart.items = updatedCartItems;
  return this.save();
};

module.exports = mongoose.model('User', userSchema);

//   async getOrders() {
//     const db = getDb();
//     return db
//       .collection('orders')
//       .find({ 'user._id': new ObjectId(this._id) }) //find in orders collection where a user's id is same as this._id
//       .toArray();
//   }

//   static findById = (userId) => {
//     const db = getDb();
//     return db.collection('users').findOne({ _id: new ObjectId(userId) });
//   };

// module.exports = User;
