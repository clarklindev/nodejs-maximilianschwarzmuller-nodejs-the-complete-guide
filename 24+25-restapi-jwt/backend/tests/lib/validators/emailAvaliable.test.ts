import { describe, it, expect } from 'vitest';
// import mongoose from 'mongoose';
import User from '../../../src/lib/models/user';
import { emailAvailable } from '../../../src/lib/validators/emailAvailable';
import sinon from 'sinon';

describe('emailAvailable()', () => {
  it('should return "Email already in use" if email already registered', async () => {
    sinon.stub(User, 'findOne');
    User.findOne.returns('Email already in use');

    const result = await emailAvailable('test@test.com');
    expect(result).toBe('Email already in use');
    User.findOne.restore();
  });

  it('should return undefined if email available', async () => {
    sinon.stub(User, 'findOne');
    User.findOne.returns(null);

    const result = await emailAvailable('test@gmail.com');
    expect(result).toBe(undefined);
    User.findOne.restore();
  });
});
