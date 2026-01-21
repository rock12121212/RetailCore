import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Delete as DeleteIcon, ThumbUp, ThumbUpOutlined } from '@mui/icons-material';
import { getVideo } from '../api/videos.js';
import { createComment, deleteComment, listCommentsByVideo } from '../api/comments.js';
import { getLikeStats, toggleLike } from '../api/likes.js';
import { useAuth } from '../hooks/useAuth.js';
import EmptyState from '../components/EmptyState.jsx';
import CommentItem from '../components/CommentItem.jsx';

const VideoDetail = () => {
  const { videoId } = useParams();
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState({ count: 0, isLiked: false });
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [posting, setPosting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [videoData, commentData, likeData] = await Promise.all([
        getVideo(videoId),
        listCommentsByVideo(videoId),
        getLikeStats('video', videoId),
      ]);
      setVideo(videoData);
      setComments(Array.isArray(commentData) ? commentData : commentData?.comments || []);
      setLikes(likeData);
    } catch (error) {
      console.error('Failed to load video details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [videoId]);

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    setPosting(true);
    try {
      await createComment({ content: commentText, videoId });
      setCommentText('');
      const data = await listCommentsByVideo(videoId);
      setComments(Array.isArray(data) ? data : data?.comments || []);
    } finally {
      setPosting(false);
    }
  };

  const handleDeleteComment = async (id) => {
    try {
      await deleteComment(id);
      setComments((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const handleToggleLike = async () => {
    try {
      const data = await toggleLike('video', videoId);
      setLikes((prev) => ({
        isLiked: data.isLiked,
        count: data.isLiked ? prev.count + 1 : prev.count - 1,
      }));
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!video) {
    return <EmptyState title="Video not found" subtitle="The video you are looking for does not exist." />;
  }

  return (
    <Stack spacing={4}>
      <Box>
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            aspectRatio: '16/9',
            borderRadius: 4,
            overflow: 'hidden',
            background: 'black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          {video.videoFile ? (
            <video
              src={video.videoFile}
              controls
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          ) : (
            <Typography color="grey.500">Video player placeholder</Typography>
          )}
        </Paper>

        <Typography variant="h4" fontWeight={800} gutterBottom>
          {video.title}
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src={video.owner?.avatar} sx={{ width: 48, height: 48 }} alt={video.owner?.username} />
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>
                {video.owner?.fullName || video.owner?.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Published on {new Date(video.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Stack>
          <Button
            variant={likes.isLiked ? 'contained' : 'outlined'}
            startIcon={likes.isLiked ? <ThumbUp /> : <ThumbUpOutlined />}
            onClick={handleToggleLike}
            sx={{ borderRadius: 20 }}
          >
            {likes.count}
          </Button>
        </Stack>

        <Card sx={{ borderRadius: 3, bgcolor: 'action.hover', border: 'none', boxShadow: 'none' }}>
          <CardContent>
            <Typography variant="body1">{video.description}</Typography>
          </CardContent>
        </Card>
      </Box>

      <Divider />

      <Box>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
          {comments.length} Comments
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
          <Avatar src={user?.avatar} />
          <TextField
            fullWidth
            placeholder="Add a comment..."
            variant="standard"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            disabled={posting}
          />
          <Button variant="contained" disabled={!commentText.trim() || posting} onClick={handlePostComment}>
            Comment
          </Button>
        </Stack>

        <List spacing={3}>
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              onDelete={handleDeleteComment}
              videoId={videoId}
            />
          ))}
        </List>
      </Box>
    </Stack>
  );
};

export default VideoDetail;
