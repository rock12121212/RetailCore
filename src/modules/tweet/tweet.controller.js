import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { Tweet } from './tweet.model.js';
import { TweetDto } from '../../dtos/tweet.dto.js';
import { deleteOwnedById } from '../../utils/crud.js';

export const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;

  const tweet = await Tweet.create({
    content,
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, TweetDto.from(tweet), 'Tweet created successfully'));
});

export const listTweets = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.ownerId) {
    filter.owner = req.query.ownerId;
  }

  const tweets = await Tweet.find(filter).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, TweetDto.fromList(tweets), 'Tweets fetched successfully'));
});

export const deleteTweet = asyncHandler(async (req, res) => {
  await deleteOwnedById(Tweet, req.params.id, req.user._id, {
    notFoundMessage: 'Tweet not found',
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Tweet deleted successfully'));
});
