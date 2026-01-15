import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { User } from './user.model.js';

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'Current user fetched successfully'));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { username, email } = req.body;

  // Real logic would update DB here
  // const user = await User.findByIdAndUpdate(req.user._id, { username, email }, { new: true });

  return res
    .status(200)
    .json(new ApiResponse(200, { username, email }, 'Profile updated successfully'));
});
