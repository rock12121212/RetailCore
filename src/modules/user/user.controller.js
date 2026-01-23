import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { ApiError } from '../../utils/apiError.js';
import { User } from './user.model.js';
import { UserDto } from '../../dtos/user.dto.js';
import { pickDefined } from '../../utils/object.js';
import { uploadOnCloudinary } from '../../utils/cloudinary.js';

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password -refreshToken');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, UserDto.from(user), 'Current user fetched successfully'));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const updates = pickDefined(req.body, ['username', 'email', 'fullName']);

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (avatarLocalPath) {
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (avatar) {
      updates.avatar = avatar.url;
    }
  }

  if (coverImageLocalPath) {
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if (coverImage) {
      updates.coverImage = coverImage.url;
    }
  }

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, 'No valid fields provided for update');
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  }).select('-password -refreshToken');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, UserDto.from(user), 'Profile updated successfully'));
});
