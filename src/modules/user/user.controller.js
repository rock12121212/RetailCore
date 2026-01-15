import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { ApiError } from '../../utils/apiError.js';
import { logInfo } from '../../utils/logger.js';
import { User } from './user.model.js';

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  logInfo('Get current user', {
    requestId: req.id,
    userId: req.user?._id || req.user?.id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'Current user fetched successfully'));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { username, email } = req.body;
  const userId = req.user?._id || req.user?.id;

  logInfo('Profile update attempt', {
    requestId: req.id,
    userId,
    updates: { username, email },
  });

  // Real logic would update DB here
  // const user = await User.findByIdAndUpdate(req.user._id, { username, email }, { new: true });

  logInfo('Profile updated successfully', {
    requestId: req.id,
    userId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { username, email }, 'Profile updated successfully'));
});
