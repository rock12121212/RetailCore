import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import * as authService from './auth.service.js';

export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const user = await authService.registerUser({ username, email, password });

  return res
    .status(201)
    .json(new ApiResponse(201, user, 'User registered successfully'));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await authService.loginUser({ email, password });

  return res
    .status(200)
    .json(new ApiResponse(200, result, 'User logged in successfully'));
});

export const logout = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'User logged out successfully'));
});
