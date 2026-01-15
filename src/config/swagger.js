import { env } from './env.config.js';
import { API_PREFIX } from '../utils/constants.js';

const serverUrl = `http://localhost:${env.port}${API_PREFIX}`;

export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'RetailCore API',
    version: '1.0.0',
    description: 'API documentation for RetailCore backend.',
  },
  servers: [
    {
      url: serverUrl,
      description: 'Local development server',
    },
  ],
  tags: [
    { name: 'Auth' },
    { name: 'Users' },
    { name: 'Videos' },
    { name: 'Comments' },
    { name: 'Likes' },
    { name: 'Tweets' },
    { name: 'Playlists' },
    { name: 'Subscriptions' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              example: {
                username: 'john_doe',
                email: 'john@example.com',
                password: 'Password123',
                fullName: 'John Doe',
              },
            },
          },
        },
        responses: {
          201: { description: 'User registered successfully' },
          400: { description: 'Validation error' },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              example: {
                email: 'john@example.com',
                password: 'Password123',
              },
            },
          },
        },
        responses: {
          200: { description: 'User logged in successfully' },
          401: { description: 'Invalid credentials' },
        },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Logout user',
        responses: {
          200: { description: 'User logged out successfully' },
        },
      },
    },
    '/users/me': {
      get: {
        tags: ['Users'],
        summary: 'Get current user',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Current user fetched successfully' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/users/profile': {
      patch: {
        tags: ['Users'],
        summary: 'Update user profile',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              example: {
                username: 'john_doe',
                email: 'john@example.com',
                fullName: 'John Doe',
                avatar: 'https://example.com/avatar.png',
                coverImage: 'https://example.com/cover.png',
              },
            },
          },
        },
        responses: {
          200: { description: 'Profile updated successfully' },
          400: { description: 'Validation error' },
        },
      },
    },
    '/videos': {
      get: {
        tags: ['Videos'],
        summary: 'List videos',
        responses: {
          200: { description: 'Videos fetched successfully' },
        },
      },
      post: {
        tags: ['Videos'],
        summary: 'Create video',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              example: {
                title: 'My Video',
                description: 'Short description',
                videoFile: 'https://example.com/video.mp4',
                thumbnail: 'https://example.com/thumb.png',
                duration: 120,
                isPublished: true,
              },
            },
          },
        },
        responses: {
          201: { description: 'Video created successfully' },
        },
      },
    },
    '/videos/{id}': {
      get: {
        tags: ['Videos'],
        summary: 'Get video by ID',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Video fetched successfully' },
          404: { description: 'Video not found' },
        },
      },
      patch: {
        tags: ['Videos'],
        summary: 'Update video',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              example: {
                title: 'Updated title',
                isPublished: false,
              },
            },
          },
        },
        responses: {
          200: { description: 'Video updated successfully' },
        },
      },
      delete: {
        tags: ['Videos'],
        summary: 'Delete video',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Video deleted successfully' },
        },
      },
    },
    '/comments/video/{videoId}': {
      get: {
        tags: ['Comments'],
        summary: 'List comments by video',
        parameters: [
          { name: 'videoId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Comments fetched successfully' },
        },
      },
    },
    '/comments': {
      post: {
        tags: ['Comments'],
        summary: 'Create comment',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              example: {
                content: 'Nice video!',
                videoId: '64b9f6c0f0d5c1a1a1a1a1a1',
              },
            },
          },
        },
        responses: {
          201: { description: 'Comment created successfully' },
        },
      },
    },
    '/comments/{id}': {
      delete: {
        tags: ['Comments'],
        summary: 'Delete comment',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Comment deleted successfully' },
        },
      },
    },
    '/likes': {
      post: {
        tags: ['Likes'],
        summary: 'Create like',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              example: {
                videoId: '64b9f6c0f0d5c1a1a1a1a1a1',
              },
            },
          },
        },
        responses: {
          201: { description: 'Like created successfully' },
        },
      },
    },
    '/likes/{id}': {
      delete: {
        tags: ['Likes'],
        summary: 'Delete like',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Like deleted successfully' },
        },
      },
    },
    '/tweets': {
      get: {
        tags: ['Tweets'],
        summary: 'List tweets',
        responses: {
          200: { description: 'Tweets fetched successfully' },
        },
      },
      post: {
        tags: ['Tweets'],
        summary: 'Create tweet',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              example: {
                content: 'Hello world!',
              },
            },
          },
        },
        responses: {
          201: { description: 'Tweet created successfully' },
        },
      },
    },
    '/tweets/{id}': {
      delete: {
        tags: ['Tweets'],
        summary: 'Delete tweet',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Tweet deleted successfully' },
        },
      },
    },
    '/playlists': {
      get: {
        tags: ['Playlists'],
        summary: 'List playlists',
        responses: {
          200: { description: 'Playlists fetched successfully' },
        },
      },
      post: {
        tags: ['Playlists'],
        summary: 'Create playlist',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              example: {
                name: 'My Playlist',
                description: 'Favorites',
                videos: [],
              },
            },
          },
        },
        responses: {
          201: { description: 'Playlist created successfully' },
        },
      },
    },
    '/playlists/{id}': {
      get: {
        tags: ['Playlists'],
        summary: 'Get playlist by ID',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Playlist fetched successfully' },
          404: { description: 'Playlist not found' },
        },
      },
      patch: {
        tags: ['Playlists'],
        summary: 'Update playlist',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              example: {
                name: 'Updated playlist name',
              },
            },
          },
        },
        responses: {
          200: { description: 'Playlist updated successfully' },
        },
      },
      delete: {
        tags: ['Playlists'],
        summary: 'Delete playlist',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Playlist deleted successfully' },
        },
      },
    },
    '/subscriptions': {
      get: {
        tags: ['Subscriptions'],
        summary: 'List subscriptions',
        responses: {
          200: { description: 'Subscriptions fetched successfully' },
        },
      },
      post: {
        tags: ['Subscriptions'],
        summary: 'Create subscription',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              example: {
                channelId: '64b9f6c0f0d5c1a1a1a1a1a1',
              },
            },
          },
        },
        responses: {
          201: { description: 'Subscribed successfully' },
        },
      },
    },
    '/subscriptions/channel/{channelId}': {
      delete: {
        tags: ['Subscriptions'],
        summary: 'Delete subscription',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'channelId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Unsubscribed successfully' },
        },
      },
    },
  },
};
