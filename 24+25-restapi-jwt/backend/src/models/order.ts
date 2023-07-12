import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  products: [
    {
      product: { type: Object, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  user: {
    email: { type: String, required: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
});

export default mongoose.model('Order', orderSchema);
