export const validationSchema = {
  email: {
    presence: true,
    email: true,
  },

  password: {
    presence: true,
    length: {
      minimum: 3,
      message: 'must be at least 3 characters long',
    },
  },
};
