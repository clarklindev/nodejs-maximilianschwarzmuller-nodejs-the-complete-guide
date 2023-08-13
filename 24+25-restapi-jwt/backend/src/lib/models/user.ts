import { Schema, model, Types } from 'mongoose';
import { IUser } from '../interfaces/IUser';

export interface CartItem {
  productId: Types.ObjectId;
  quantity: number;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      required: true,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    resetToken: {
      type: String,
      required: false,
    },

    resetTokenExpiration: {
      type: Number,
      required: false,
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

    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
    ],

    //add orders:[]
  },
  {
    methods: {
      addToCart(product: any) {
        //check if it exists in cart
        const cartProductIndex =
          this.cart?.items?.findIndex((cartProduct) => {
            return cartProduct.productId.toString() === product._id.toString();
          }) ?? -1;

        let newQuantity = 1;
        const updatedCartItems = this.cart?.items ? [...this.cart.items] : [];

        //if it is already in the cart
        if (this.cart && cartProductIndex >= 0) {
          //already exists so increase quantity on cart item
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
      },

      deleteFromCart(productId: any) {
        try {
          if (this.cart?.items.length) {
            const updatedCartItems = this?.cart?.items.filter((item) => {
              const a = item.productId.toString();
              const b = productId.toString();
              return a !== b;
            });

            this.cart.items = updatedCartItems;
            return this.save();
          }
        } catch (err) {
          console.log(err);
        }
      },

      clearCart() {
        this.cart = { items: [] };
        return this.save();
      },

      addToProducts(productId) {
        const updatedProducts = this.products ? [...this.products] : [];
        updatedProducts.push(productId);
        this.products = updatedProducts;
        return this.save();
      },
    },
  },
);

export default model<IUser>('User', userSchema);
