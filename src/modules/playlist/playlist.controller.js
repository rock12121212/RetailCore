import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { ApiError } from '../../utils/apiError.js';
import { Playlist } from './playlist.model.js';
import { PlaylistDto } from '../../dtos/playlist.dto.js';
import { pickDefined } from '../../utils/object.js';
import { deleteOwnedById, findByIdOrThrow, updateOwnedById } from '../../utils/crud.js';

export const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description, videos } = req.body;

  const playlist = await Playlist.create({
    name,
    description,
    videos: videos || [],
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, PlaylistDto.from(playlist), 'Playlist created successfully'));
});

export const listPlaylists = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.ownerId) {
    filter.owner = req.query.ownerId;
  }

  const playlists = await Playlist.find(filter).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, PlaylistDto.fromList(playlists), 'Playlists fetched successfully'));
});

export const getPlaylistById = asyncHandler(async (req, res) => {
  const playlist = await findByIdOrThrow(Playlist, req.params.id, 'Playlist not found');

  return res
    .status(200)
    .json(new ApiResponse(200, PlaylistDto.from(playlist), 'Playlist fetched successfully'));
});

export const updatePlaylist = asyncHandler(async (req, res) => {
  const updates = pickDefined(req.body, ['name', 'description', 'videos']);

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, 'No valid fields provided for update');
  }

  const updated = await updateOwnedById(Playlist, req.params.id, updates, req.user._id, {
    notFoundMessage: 'Playlist not found',
  });

  return res
    .status(200)
    .json(new ApiResponse(200, PlaylistDto.from(updated), 'Playlist updated successfully'));
});

export const deletePlaylist = asyncHandler(async (req, res) => {
  await deleteOwnedById(Playlist, req.params.id, req.user._id, {
    notFoundMessage: 'Playlist not found',
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Playlist deleted successfully'));
});
