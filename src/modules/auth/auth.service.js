import jwt from 'jsonwebtoken';
import { User } from '../user/user.model.js';
import { ApiError } from '../../utils/apiError.js';
import { UserDto } from '../../dtos/user.dto.js';
import { env } from '../../config/env.config.js';

export const registerUser = async (userData) => {
  const user = await User.findOne({
    $or: [
      { email: userData.email },
      { username: userData.username },
    ],
  })

  if (user) {
    const isEmailDuplicate = user.email === userData.email;
    const field = isEmailDuplicate ? 'email' : 'username';
    throw new ApiError(400, `User with this ${field} already exists`, [
      {
        field,
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} is already taken`,
      },
    ]);
  }

  const newUser = await User.create(userData);
  return UserDto.from(newUser);
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid password');
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return {
    user: UserDto.from(user),
    accessToken,
    refreshToken,
  };
};

export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new ApiError(401, 'Refresh token is required');
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(refreshToken, env.jwt.refreshSecret);
  } catch (error) {
    throw new ApiError(401, error?.message || 'Invalid refresh token');
  }

  const user = await User.findById(decodedToken?._id);

  if (!user || user.refreshToken !== refreshToken) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  const accessToken = user.generateAccessToken();
  const newRefreshToken = user.generateRefreshToken();

  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  return {
    user: UserDto.from(user),
    accessToken,
    refreshToken: newRefreshToken,
  };
};

export const clearRefreshToken = async (refreshToken) => {
  if (!refreshToken) return;

  const user = await User.findOne({ refreshToken });
  if (!user) return;

  user.refreshToken = undefined;
  await user.save({ validateBeforeSave: false });
};
