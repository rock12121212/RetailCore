import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { ApiError } from '../../utils/apiError.js';
import { Video } from './video.model.js';
import { VideoDto } from '../../dtos/video.dto.js';
import { pickDefined } from '../../utils/object.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../../utils/cloudinary.js';
import {
  deleteOwnedById,
  ensureOwner,
  findByIdOrThrow,
  updateOwnedById,
} from '../../utils/crud.js';

export const createVideo = asyncHandler(async (req, res) => {
  const { title, description, isPublished } = req.body;

  const videoFileLocalPath = req.files?.videoFile?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  if (!videoFileLocalPath) {
    throw new ApiError(400, 'Video file is required');
  }

  const videoFile = await uploadOnCloudinary(videoFileLocalPath);
  if (!videoFile) {
    throw new ApiError(500, 'Failed to upload video file');
  }

  let thumbnail = '';
  if (thumbnailLocalPath) {
    const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if (uploadedThumbnail) {
      thumbnail = uploadedThumbnail.url;
    }
  }

  const video = await Video.create({
    title,
    description,
    videoFile: videoFile.url,
    thumbnail: thumbnail || videoFile.url.replace(/\.[^/.]+$/, '.jpg'), // Fallback to video auto-gen thumbnail if possible
    duration: videoFile.duration,
    isPublished,
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, VideoDto.from(video), 'Video created successfully'));
});

export const listVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find()
    .populate('owner', 'username email fullName avatar')
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, VideoDto.fromList(videos), 'Videos fetched successfully'));
});

export const getVideoById = asyncHandler(async (req, res) => {
  const video = await findByIdOrThrow(Video, req.params.id, 'Video not found');
  await video.populate('owner', 'username email fullName avatar');

  return res
    .status(200)
    .json(new ApiResponse(200, VideoDto.from(video), 'Video fetched successfully'));
});

export const updateVideo = asyncHandler(async (req, res) => {
  const updates = pickDefined(req.body, ['title', 'description', 'isPublished']);

  const videoFileLocalPath = req.files?.videoFile?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  if (videoFileLocalPath) {
    const videoFile = await uploadOnCloudinary(videoFileLocalPath);
    if (videoFile) {
      updates.videoFile = videoFile.url;
      updates.duration = videoFile.duration;
    }
  }

  if (thumbnailLocalPath) {
    const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if (uploadedThumbnail) {
      updates.thumbnail = uploadedThumbnail.url;
    }
  }

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, 'No valid fields provided for update');
  }

  const updated = await updateOwnedById(Video, req.params.id, updates, req.user._id, {
    notFoundMessage: 'Video not found',
  });

  return res
    .status(200)
    .json(new ApiResponse(200, VideoDto.from(updated), 'Video updated successfully'));
});

export const deleteVideo = asyncHandler(async (req, res) => {
  const video = await findByIdOrThrow(Video, req.params.id, 'Video not found');
  ensureOwner(video, req.user._id);

  // Extract public IDs from Cloudinary URLs
  // Note: This logic assumes public IDs don't contain slashes or complex paths
  const getPublicId = (url) => url?.split('/').pop().split('.')[0];

  if (video.videoFile) {
    const videoPublicId = getPublicId(video.videoFile);
    await deleteFromCloudinary(videoPublicId, 'video');
  }

  if (video.thumbnail) {
    const thumbnailPublicId = getPublicId(video.thumbnail);
    await deleteFromCloudinary(thumbnailPublicId, 'image');
  }

  await video.deleteOne();

  return res.status(200).json(new ApiResponse(200, {}, 'Video deleted successfully'));
});
