export const validationSchema = {
  username: {
    presence: { message: 'is required' },
  },

  email: {
    presence: true,
    email: true,
    emailAvailable: true, //this uses a custom validator that is async (which means caller needs to be async)
  },

  password: {
    presence: true,
    length: {
      minimum: 3,
      message: 'must be at least 3 characters long',
    },
  },
};
