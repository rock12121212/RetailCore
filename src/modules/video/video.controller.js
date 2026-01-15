import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { ApiError } from '../../utils/apiError.js';
import { Video } from './video.model.js';
import { VideoDto } from '../../dtos/video.dto.js';
import { pickDefined } from '../../utils/object.js';
import { deleteOwnedById, findByIdOrThrow, updateOwnedById } from '../../utils/crud.js';

export const createVideo = asyncHandler(async (req, res) => {
  const { title, description, videoFile, thumbnail, duration, isPublished } = req.body;

  const video = await Video.create({
    title,
    description,
    videoFile,
    thumbnail,
    duration,
    isPublished,
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, VideoDto.from(video), 'Video created successfully'));
});

export const listVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find().sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, VideoDto.fromList(videos), 'Videos fetched successfully'));
});

export const getVideoById = asyncHandler(async (req, res) => {
  const video = await findByIdOrThrow(Video, req.params.id, 'Video not found');

  return res
    .status(200)
    .json(new ApiResponse(200, VideoDto.from(video), 'Video fetched successfully'));
});

export const updateVideo = asyncHandler(async (req, res) => {
  const updates = pickDefined(req.body, [
    'title',
    'description',
    'videoFile',
    'thumbnail',
    'duration',
    'isPublished',
  ]);

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
  await deleteOwnedById(Video, req.params.id, req.user._id, {
    notFoundMessage: 'Video not found',
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Video deleted successfully'));
});
