import crypto from 'crypto';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { env } from '../../config/env.config.js';
import * as authService from './auth.service.js';
import { uploadOnCloudinary } from '../../utils/cloudinary.js';
import { ApiError } from '../../utils/apiError.js';

const isProd = env.nodeEnv === 'production';

const toMs = (value, defaultMs) => {
  if (!value) return defaultMs;
  if (typeof value === 'number') return value;

  const match = String(value).trim().match(/^(\d+)(ms|s|m|h|d)?$/i);
  if (!match) return defaultMs;

  const amount = Number(match[1]);
  const unit = (match[2] || 'ms').toLowerCase();

  switch (unit) {
    case 'd':
      return amount * 24 * 60 * 60 * 1000;
    case 'h':
      return amount * 60 * 60 * 1000;
    case 'm':
      return amount * 60 * 1000;
    case 's':
      return amount * 1000;
    default:
      return amount;
  }
};

const getCookieOptions = (maxAgeMs, httpOnly = true) => ({
  httpOnly,
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax',
  maxAge: maxAgeMs,
  path: '/',
});

const setAuthCookies = (res, { refreshToken, csrfToken }) => {
  const refreshMaxAgeMs = toMs(env.jwt.refreshExpiresIn, 30 * 24 * 60 * 60 * 1000);
  const refreshCookieOptions = getCookieOptions(refreshMaxAgeMs, true);
  const csrfCookieOptions = getCookieOptions(refreshMaxAgeMs, false);

  res.cookie('refreshToken', refreshToken, refreshCookieOptions);
  res.cookie('csrfToken', csrfToken, csrfCookieOptions);
};

const clearAuthCookies = (res) => {
  const refreshMaxAgeMs = 0;
  const refreshCookieOptions = getCookieOptions(refreshMaxAgeMs, true);
  const csrfCookieOptions = getCookieOptions(refreshMaxAgeMs, false);

  res.clearCookie('refreshToken', refreshCookieOptions);
  res.clearCookie('csrfToken', csrfCookieOptions);
};

export const register = asyncHandler(async (req, res) => {
  const { username, email, password, fullName } = req.body;

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  let avatar = '';
  if (avatarLocalPath) {
    const uploadedAvatar = await uploadOnCloudinary(avatarLocalPath);
    if (uploadedAvatar) {
      avatar = uploadedAvatar.url;
    }
  }

  let coverImage = '';
  if (coverImageLocalPath) {
    const uploadedCoverImage = await uploadOnCloudinary(coverImageLocalPath);
    if (uploadedCoverImage) {
      coverImage = uploadedCoverImage.url;
    }
  }

  const user = await authService.registerUser({
    username,
    email,
    password,
    fullName,
    avatar,
    coverImage,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, user, 'User registered successfully'));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await authService.loginUser({ email, password });
  const csrfToken = crypto.randomBytes(32).toString('hex');

  setAuthCookies(res, {
    refreshToken: result.refreshToken,
    csrfToken,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          user: result.user,
          accessToken: result.accessToken,
          csrfToken,
        },
        'User logged in successfully'
      )
    );
});

export const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  const result = await authService.refreshAccessToken(refreshToken);
  const csrfToken = crypto.randomBytes(32).toString('hex');

  setAuthCookies(res, {
    refreshToken: result.refreshToken,
    csrfToken,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: result.user,
        accessToken: result.accessToken,
        csrfToken,
      },
      'Access token refreshed successfully'
    )
  );
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  await authService.clearRefreshToken(refreshToken);
  clearAuthCookies(res);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'User logged out successfully'));
});
