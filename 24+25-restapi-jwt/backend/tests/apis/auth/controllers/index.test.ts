import { describe, beforeAll, beforeEach, afterAll } from 'vitest';
import mongoose from 'mongoose';
import User from '../../../../src/lib/models/user';

beforeAll(async () => {
  const MONGODB_URI = `mongodb://${import.meta.env.VITE_MONGODB_USER}:${
    import.meta.env.VITE_MONGODB_PASSWORD
  }@ac-yztvzc4-shard-00-00.b5tvnqi.mongodb.net:27017,ac-yztvzc4-shard-00-01.b5tvnqi.mongodb.net:27017,ac-yztvzc4-shard-00-02.b5tvnqi.mongodb.net:27017/?ssl=true&replicaSet=atlas-dbcw9j-shard-0&authSource=admin&retryWrites=true&w=majority`;
  const dbName = 'test-contacts';
  await mongoose.connect(MONGODB_URI, { dbName });
});

beforeEach(async () => {
  await User.deleteMany({});

  const user = new User({
    email: 'test@test.com',
    password: 'tester',
    username: 'Test',
    posts: [],
    _id: '5c0f66b979af55031b34728a',
  });
  await user.save();
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('auth controller', () => {
  describe('login()', () => {});

  describe('signup()', () => {});

  describe('resetPassword()', () => {});

  describe('saveNewPassword()', () => {});
});
