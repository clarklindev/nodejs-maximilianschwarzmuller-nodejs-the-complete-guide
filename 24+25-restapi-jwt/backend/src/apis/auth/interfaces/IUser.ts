import { Document, Model, Types } from 'mongoose'; //import Document is NB

// Interface representing a single item in the cart
interface CartItem {
  productId: Types.ObjectId;
  quantity: number;
}

// Interface representing the User document in MongoDB
export interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  resetToken?: string | null;
  resetTokenExpiration?: number | null;
  _doc: any;
  cart: {
    items: CartItem[];
  };
  products: Types.ObjectId[];
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