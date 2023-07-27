import { Document, Model, Types } from 'mongoose';

// Interface representing a single item in the cart
interface CartItem {
  productId: Types.ObjectId;
  quantity: number;
}

// Interface representing the User document in MongoDB
interface IUser {
  email: string;
  password: string;
  username: string;
  resetToken?: string | null;
  resetTokenExpiration?: number | null;
  cart: {
    items: CartItem[];
  };
  products: Types.ObjectId[];
}

// Interface representing the User mongoose model type
interface IUserModel extends Model<IUser> {
  // Add any static methods here if required
}

// Interface representing the User document with added instance methods
interface IUserDocument extends IUser, Document {
  // Add instance methods defined in the schema's 'methods' section
  addToCart(product: any): Promise<IUserDocument>;
  deleteFromCart(productId: any): Promise<IUserDocument>;
  clearCart(): Promise<IUserDocument>;
  addToProducts(productId: any): Promise<IUserDocument>;
}

export { IUser, IUserModel, IUserDocument };
