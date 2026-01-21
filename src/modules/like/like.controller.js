import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { ApiError } from '../../utils/apiError.js';
import { Like } from './like.model.js';
import { LikeDto } from '../../dtos/like.dto.js';
import { deleteOwnedById } from '../../utils/crud.js';

const getLikeTarget = (data) => {
  const { videoId, commentId, tweetId } = data;
  const targets = [
    { key: 'video', value: videoId, field: 'video' },
    { key: 'comment', value: commentId, field: 'comment' },
    { key: 'tweet', value: tweetId, field: 'tweet' },
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

export const toggleLike = asyncHandler(async (req, res) => {
  const target = getLikeTarget(req.body);

  if (!target) {
    throw new ApiError(400, 'Provide exactly one of videoId, commentId, or tweetId');
  }

  const existingLike = await Like.findOne({
    likedBy: req.user._id,
    [target.key]: target.value,
  });

  if (existingLike) {
    await existingLike.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, { isLiked: false }, 'Like removed successfully'));
  }

  const like = await Like.create({
    likedBy: req.user._id,
    [target.key]: target.value,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { ...LikeDto.from(like), isLiked: true }, 'Like added successfully'));
});

export const getLikeStats = asyncHandler(async (req, res) => {
  const target = getLikeTarget(req.query);

  if (!target) {
    throw new ApiError(400, 'Provide exactly one of videoId, commentId, or tweetId in query');
  }

  const [count, userLike] = await Promise.all([
    Like.countDocuments({ [target.key]: target.value }),
    req.user ? Like.findOne({ likedBy: req.user._id, [target.key]: target.value }) : null,
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        count,
        isLiked: !!userLike,
      },
      'Like stats fetched successfully'
    )
  );
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
