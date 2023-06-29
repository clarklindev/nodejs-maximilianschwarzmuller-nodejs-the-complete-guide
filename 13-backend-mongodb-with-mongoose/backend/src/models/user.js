const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  resetToken: String,
  resetTokenExpiration: Date,

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

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
