const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const currentTime = new Date().getTime(); //.getTime() uses Unix Epoch

const contactSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },

    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'Contact',
      required: true,
    },

    createdAt: {
      type: Number,
      default: () => currentTime,
    },
    updatedAt: {
      type: Number,
      default: () => currentTime,
    },
  },

  { timestamps: false, strict: false }
);

module.exports = mongoose.model('Contact', contactSchema);
