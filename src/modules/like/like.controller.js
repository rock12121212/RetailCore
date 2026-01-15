import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { ApiError } from '../../utils/apiError.js';
import { Like } from './like.model.js';
import { LikeDto } from '../../dtos/like.dto.js';
import { deleteOwnedById } from '../../utils/crud.js';

const getLikeTarget = (body) => {
  const { videoId, commentId, tweetId } = body;
  const targets = [
    { key: 'video', value: videoId },
    { key: 'comment', value: commentId },
    { key: 'tweet', value: tweetId },
  ].filter((target) => target.value);

  if (targets.length !== 1) {
    return null;
  }

  return targets[0];
};

export const createLike = asyncHandler(async (req, res) => {
  const target = getLikeTarget(req.body);

  if (!target) {
    throw new ApiError(400, 'Provide exactly one of videoId, commentId, or tweetId');
  }

  const like = await Like.create({
    likedBy: req.user._id,
    [target.key]: target.value,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, LikeDto.from(like), 'Like created successfully'));
});

export const deleteLike = asyncHandler(async (req, res) => {
  await deleteOwnedById(Like, req.params.id, req.user._id, {
    notFoundMessage: 'Like not found',
    ownerField: 'likedBy',
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Like deleted successfully'));
});
