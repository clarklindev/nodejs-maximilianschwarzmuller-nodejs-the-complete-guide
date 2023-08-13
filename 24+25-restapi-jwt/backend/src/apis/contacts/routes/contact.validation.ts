import { ITenant } from '../../../lib/interfaces/ITenant';

export const validationSchema = (tenant: ITenant) => {
  const constraints = {
    email: {
      email: true,
      presence: true,
    },
    firstName: {
      type: 'string',
      length: {
        minimum: 2,
        maximum: 50,
        message: 'must be between 2 and 50 characters',
      },
      format: {
        pattern: /^[a-zA-Z\s']+$/,
        message: 'can only contain letters, spaces, and apostrophes',
      },
    },
    lastName: {
      type: 'string',
      length: {
        minimum: 2,
        maximum: 50,
        message: 'must be between 2 and 50 characters',
      },
      format: {
        pattern: /^[a-zA-Z\s']+$/,
        message: 'can only contain letters, spaces, and apostrophes',
      },
    },
    phoneNumber: {
      isPhoneNumber: { countryCode: tenant.countryCode },
    },
  };

  let additionalConstraints = {};
  if (tenant.countryCode === 'US') {
    additionalConstraints = {};
  }

  return { ...constraints, ...additionalConstraints };
};
