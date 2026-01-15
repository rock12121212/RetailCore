import { Router } from 'express';

// Import module routes
import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/user/user.routes.js';
import videoRoutes from './modules/video/video.routes.js';
import commentRoutes from './modules/comment/comment.routes.js';
import likeRoutes from './modules/like/like.routes.js';
import tweetRoutes from './modules/tweet/tweet.routes.js';
import playlistRoutes from './modules/playlist/playlist.routes.js';
import subscriptionRoutes from './modules/subscription/subscription.routes.js';

const router = Router();

// Register module routes
// add route
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/videos', videoRoutes);
router.use('/comments', commentRoutes);
router.use('/likes', likeRoutes);
router.use('/tweets', tweetRoutes);
router.use('/playlists', playlistRoutes);
router.use('/subscriptions', subscriptionRoutes);

export default router;
