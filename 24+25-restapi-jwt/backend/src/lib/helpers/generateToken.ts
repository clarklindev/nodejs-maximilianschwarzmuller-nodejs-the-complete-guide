import jwt from 'jsonwebtoken';

export const generateToken = async (payload: any) => {
  return await jwt.sign(payload, process.env.JWT_SECRET as jwt.Secret, {
    expiresIn: '1h',
  });
};
