export const validationSchema = {
  name: {
    presence: true,
  },
  email: {
    presence: true,
    email: true,
    emailExists: true,
  },
  password: {
    presence: true,
    length: {
      minimum: 3,
      message: 'must be at least 3 characters long',
    },
  },
};
