import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { ApiError } from '../../utils/apiError.js';
import { Subscription } from './subscription.model.js';
import { SubscriptionDto } from '../../dtos/subscription.dto.js';

export const createSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.body;

  if (channelId === req.user._id.toString()) {
    throw new ApiError(400, 'You cannot subscribe to yourself');
  }

  const subscription = await Subscription.create({
    subscriber: req.user._id,
    channel: channelId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, SubscriptionDto.from(subscription), 'Subscribed successfully'));
});

export const listSubscriptions = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.channelId) {
    filter.channel = req.query.channelId;
  }
  if (req.query.subscriberId) {
    filter.subscriber = req.query.subscriberId;
  }

  const subscriptions = await Subscription.find(filter).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, SubscriptionDto.fromList(subscriptions), 'Subscriptions fetched successfully'));
});

export const deleteSubscription = asyncHandler(async (req, res) => {
  const subscription = await Subscription.findOne({
    subscriber: req.user._id,
    channel: req.params.channelId,
  });

  if (!subscription) {
    throw new ApiError(404, 'Subscription not found');
  }

  await subscription.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Unsubscribed successfully'));
});
