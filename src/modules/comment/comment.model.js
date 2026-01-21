import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Video',
      required: true,
      index: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Comment = mongoose.model('Comment', commentSchema);
