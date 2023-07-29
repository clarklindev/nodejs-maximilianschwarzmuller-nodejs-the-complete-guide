export const validationSchema = {
  title: {
    presence: true,
    type: 'string',
    length: {
      minimum: 3,
    },
  },
  price: {
    type: 'string',
    // floatWithTwoDecimals: true,
  },
  description: {
    length: {
      minimum: 3,
      maximum: 20,
    },
  },
};
