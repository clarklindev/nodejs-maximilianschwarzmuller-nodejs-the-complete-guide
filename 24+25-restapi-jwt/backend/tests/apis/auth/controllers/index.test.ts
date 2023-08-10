import { expect, describe, it, vi } from 'vitest';
import { Types } from 'mongoose';
import { login } from '../../../../src/apis/auth/controllers';
import sinon from 'sinon';

// import validate from '../../../../src/lib/validators'; // import validate from 'validate.js';  //NB: dont import validate directly
// import { validationSchema as authSignupValidation } from '../../../../src/apis/auth/controllers/authSignup.validation';
// import { validationSchema as authLoginValidation } from '../../../../src/apis/auth/controllers/authLogin.validation';
// import User from '../../../../src/lib/models/user';
// import { jsonApiErrorResponseFromValidateJsError } from '../../../../src/lib/helpers/jsonApiErrorResponseFromValidateJsError';
// import { findUser } from '../../../../src/apis/auth/helpers/findUser';
// import { getEmailTransporter } from '../../../../src/lib/helpers/getEmailTransporter';
// import { IError } from '../../../../src/lib/interfaces/IError';
import { CartItem } from '../../../../src/lib/interfaces/ICartItem';

describe('auth controller', () => {
  describe('login()', () => {
    const req = {
      body: {
        data: {
          attributes: {
            email: 'info@internet.com',
            password: '123',
            username: 'someone',
          },
        },
      },
    };

    const res = {
      json: vi.fn(),
    };

    const next = vi.fn();
    const validate = vi.fn();
    const findUser = vi.fn();
    const authenticateUser = vi.fn();
    const generateToken = vi.fn();

    it('happy case: should return response that has "token"', async () => {
      validate.mockResolvedValue(undefined);
      findUser.mockResolvedValue({
        _id: 'user_id',
        email: 'info@internet.com',
        password: '123',
        username: 'someone',
        cart: {
          items: Array<CartItem>,
        },
        products: Array<Types.ObjectId>,
      });
      authenticateUser.mockResolvedValue(true);
      generateToken.mockResolvedValue('abcdefg');
      res.json.mockResolvedValue({
        meta: {
          token: 'abcdefg',
          message: 'User successfully logged in.',
        },
      });

      await login(req, res, next);
    });
  });

  // describe('signup()', () => {});

  // describe('resetPassword()', () => {});

  // describe('saveNewPassword()', () => {});
});
