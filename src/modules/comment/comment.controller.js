import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { Comment } from './comment.model.js';
import { CommentDto } from '../../dtos/comment.dto.js';
import { deleteOwnedById } from '../../utils/crud.js';
import { Like } from '../like/like.model.js';
import mongoose from 'mongoose';

export const createComment = asyncHandler(async (req, res) => {
  const { content, videoId } = req.body;

  const comment = await Comment.create({
    content,
    video: videoId,
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, CommentDto.from(comment), 'Comment created successfully'));
});

export const listCommentsByVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const commentsWithStats = await Comment.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
        parentComment: null,
      },
    },
    {
      $lookup: {
        from: 'comments',
        localField: '_id',
        foreignField: 'parentComment',
        as: 'replies',
      },
    },
    {
      $lookup: {
        from: 'likes',
        localField: '_id',
        foreignField: 'comment',
        as: 'likes',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'owner',
        foreignField: '_id',
        as: 'owner',
      },
    },
    { $unwind: '$owner' },
    {
      $addFields: {
        likesCount: { $size: '$likes' },
        repliesCount: { $size: '$replies' },
        isLiked: {
          $cond: {
            if: {
              $in: [new mongoose.Types.ObjectId(req.user?._id), '$likes.likedBy'],
            },
            then: true,
            else: false,
          },
        },
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $project: {
        content: 1,
        createdAt: 1,
        updatedAt: 1,
        'owner._id': 1,
        'owner.username': 1,
        'owner.fullName': 1,
        'owner.avatar': 1,
        likesCount: 1,
        repliesCount: 1,
        isLiked: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, CommentDto.fromList(commentsWithStats), 'Comments fetched successfully'));
});

export const addReply = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { commentId } = req.params;

  const parent = await Comment.findById(commentId);
  if (!parent) {
    return res.status(404).json(new ApiResponse(404, {}, 'Parent comment not found'));
  }

  const reply = await Comment.create({
    content,
    video: parent.video,
    owner: req.user._id,
    parentComment: commentId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, CommentDto.from(reply), 'Reply added successfully'));
});

export const getReplies = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const replies = await Comment.aggregate([
    { $match: { parentComment: new mongoose.Types.ObjectId(commentId) } },
    {
      $lookup: {
        from: 'comments',
        localField: '_id',
        foreignField: 'parentComment',
        as: 'replies',
      },
    },
    {
      $lookup: {
        from: 'likes',
        localField: '_id',
        foreignField: 'comment',
        as: 'likes',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'owner',
        foreignField: '_id',
        as: 'owner',
      },
    },
    { $unwind: '$owner' },
    {
      $addFields: {
        likesCount: { $size: '$likes' },
        repliesCount: { $size: '$replies' },
        isLiked: {
          $cond: {
            if: {
              $in: [new mongoose.Types.ObjectId(req.user?._id), '$likes.likedBy'],
            },
            then: true,
            else: false,
          },
        },
      },
    },
    { $sort: { createdAt: 1 } },
    {
      $project: {
        content: 1,
        createdAt: 1,
        updatedAt: 1,
        'owner._id': 1,
        'owner.username': 1,
        'owner.fullName': 1,
        'owner.avatar': 1,
        likesCount: 1,
        repliesCount: 1,
        isLiked: 1,
        parentComment: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, CommentDto.fromList(replies), 'Replies fetched successfully'));
});

export const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return res.status(404).json(new ApiResponse(404, {}, 'Comment not found'));
  }

  if (comment.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json(new ApiResponse(403, {}, 'Unauthorized'));
  }

  // If it's a top-level comment, we might want to delete its replies too
  if (!comment.parentComment) {
    await Comment.deleteMany({ parentComment: comment._id });
  }

  await Comment.findByIdAndDelete(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Comment deleted successfully'));
});
