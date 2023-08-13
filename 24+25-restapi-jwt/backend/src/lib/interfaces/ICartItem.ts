import { Types } from 'mongoose'; //import Document is NB

// Interface representing a single item in the cart
export interface CartItem {
  productId: Types.ObjectId;
  quantity: number;
}
