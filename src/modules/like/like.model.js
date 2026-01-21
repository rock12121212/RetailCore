import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema(
  {
    likedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Video',
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
    tweet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tweet',
    },
  },
  {
    timestamps: true,
  }
);

likeSchema.pre('validate', async function () {
  const targets = [this.video, this.comment, this.tweet].filter(Boolean);
  if (targets.length !== 1) {
    throw new Error('Like must reference exactly one target');
  }
});

export const Like = mongoose.model('Like', likeSchema);
