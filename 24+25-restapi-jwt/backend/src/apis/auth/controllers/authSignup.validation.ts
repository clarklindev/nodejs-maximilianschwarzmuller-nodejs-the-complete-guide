export const validationSchema = {
  username: {
    presence: { message: 'is required' },
  },

  email: {
    presence: true,
    email: true,
    emailAvailable: true,
  },

  password: {
    presence: true,
    length: {
      minimum: 3,
      message: 'must be at least 3 characters long',
    },
  },
};
