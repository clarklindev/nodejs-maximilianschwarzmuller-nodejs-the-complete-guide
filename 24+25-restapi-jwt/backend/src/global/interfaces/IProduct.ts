import { Document, Schema, Model } from 'mongoose';

// Interface representing the Product document in MongoDB
interface IProduct {
  title: string;
  price: string;
  description: string;
  imageUrl: string;
  userId: Schema.Types.ObjectId;
}

// Interface representing the Product mongoose model type
interface IProductModel extends Model<IProduct> {}

// Interface representing the Product document with added instance methods (if any)
interface IProductDocument extends IProduct, Document {
  // Add any instance methods here if required
}

export { IProduct, IProductModel, IProductDocument };
