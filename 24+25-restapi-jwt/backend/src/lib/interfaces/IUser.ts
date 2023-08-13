import { Document, Model, Types } from 'mongoose'; //import Document is NB
import { CartItem } from './ICartItem';

// Interface representing the User document in MongoDB
export interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  verified: boolean;
  resetToken?: string | null;
  resetTokenExpiration?: number | null;
  cart: {
    items: CartItem[];
  };
  products: Types.ObjectId[];
  _doc?: any;
}

// Interface representing the User mongoose model type
export interface IUserModel extends Model<IUser> {
  // Add any static methods here if required
}

// Interface representing the User document with added instance methods
export interface IUserDocument extends IUser, Document {
  // Add instance methods defined in the schema's 'methods' section
  addToCart(product: any): Promise<IUserDocument>;
  deleteFromCart(productId: any): Promise<IUserDocument>;
  clearCart(): Promise<IUserDocument>;
  addToProducts(productId: any): Promise<IUserDocument>;
}
