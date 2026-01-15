import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { Comment } from './comment.model.js';
import { CommentDto } from '../../dtos/comment.dto.js';
import { deleteOwnedById } from '../../utils/crud.js';

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
  const comments = await Comment.find({ video: req.params.videoId })
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, CommentDto.fromList(comments), 'Comments fetched successfully'));
});

export const deleteComment = asyncHandler(async (req, res) => {
  await deleteOwnedById(Comment, req.params.id, req.user._id, {
    notFoundMessage: 'Comment not found',
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Comment deleted successfully'));
});
