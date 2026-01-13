import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { ApiError } from '../../utils/apiError.js';
import { logInfo, logError } from '../../utils/logger.js';
import * as authService from './auth.service.js';

export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  logInfo('User registration attempt', {
    requestId: req.id,
    email,
    username,
  });

  const user = await authService.registerUser({ username, email, password });

  logInfo('User registered successfully', {
    requestId: req.id,
    userId: user._id,
    email,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, user, 'User registered successfully'));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  logInfo('User login attempt', {
    requestId: req.id,
    email,
  });

  const result = await authService.loginUser({ email, password });

  logInfo('User logged in successfully', {
    requestId: req.id,
    userId: result.user._id,
    email,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, result, 'User logged in successfully'));
});

export const logout = asyncHandler(async (req, res) => {
  logInfo('User logout', {
    requestId: req.id,
    userId: req.user?._id || req.user?.id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'User logged out successfully'));
});
