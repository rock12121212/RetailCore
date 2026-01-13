import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { env } from '../config/env.config.js';

export const verifyJWT = asyncHandler(async (req, _res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError(401, 'Unauthorized request');
    }

    const decodedToken = jwt.verify(token, env.jwt.secret);
    
    // In a real app, you'd fetch the user from DB here
    // const user = await User.findById(decodedToken?._id).select('-password');
    // if (!user) throw new ApiError(401, 'Invalid Access Token');
    // req.user = user;

    req.user = decodedToken;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || 'Invalid access token');
  }
});
