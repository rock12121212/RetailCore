import { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Collapse,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Reply as ReplyIcon,
  ThumbUp,
  ThumbUpOutlined,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth.js';
import { toggleLike } from '../api/likes.js';
import { addReply, getReplies } from '../api/comments.js';

const CommentItem = ({ comment, onDelete, videoId }) => {
  const { user } = useAuth();
  const [data, setData] = useState(comment);
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [postingReply, setPostingReply] = useState(false);

  const handleToggleLike = async () => {
    try {
      const response = await toggleLike('comment', data._id);
      setData((prev) => ({
        ...prev,
        isLiked: response.isLiked,
        likesCount: response.isLiked ? prev.likesCount + 1 : prev.likesCount - 1,
      }));
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleFetchReplies = async () => {
    if (showReplies) {
      setShowReplies(false);
      return;
    }

    setShowReplies(true);
    if (replies.length > 0) return;

    setLoadingReplies(true);
    try {
      const result = await getReplies(data._id);
      setReplies(result);
    } catch (error) {
      console.error('Failed to fetch replies:', error);
    } finally {
      setLoadingReplies(false);
    }
  };

  const handlePostReply = async () => {
    if (!replyText.trim()) return;
    setPostingReply(true);
    try {
      const newReply = await addReply(data._id, replyText);
      setReplies((prev) => [...prev, newReply]);
      setReplyText('');
      setShowReplyInput(false);
      setShowReplies(true);
      setData((prev) => ({ ...prev, repliesCount: (prev.repliesCount || 0) + 1 }));
    } catch (error) {
      console.error('Failed to post reply:', error);
    } finally {
      setPostingReply(false);
    }
  };

  return (
    <Stack direction="row" spacing={2} sx={{ width: '100%', mb: 2, position: 'relative' }}>
      <Avatar src={data.owner?.avatar} sx={{ width: 40, height: 40 }} />
      
      <Box sx={{ flexGrow: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle2" fontWeight={700}>
            {data.owner?.fullName || data.owner?.username || 'User'} •{' '}
            <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 400 }}>
              {new Date(data.createdAt).toLocaleDateString()}
            </Box>
          </Typography>
          
          {(data.owner?._id === user?._id || data.owner === user?._id) && (
            <IconButton size="small" onClick={() => onDelete(data._id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>

        <Typography variant="body1" color="text.primary" sx={{ mt: 0.5 }}>
          {data.content}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
          <IconButton size="small" onClick={handleToggleLike}>
            {data.isLiked ? (
              <ThumbUp fontSize="inherit" color="primary" />
            ) : (
              <ThumbUpOutlined fontSize="inherit" />
            )}
          </IconButton>
          <Typography variant="caption" color="text.secondary">
            {data.likesCount}
          </Typography>
          
          <Button 
            size="small" 
            startIcon={<ReplyIcon />} 
            onClick={() => setShowReplyInput(!showReplyInput)}
            sx={{ textTransform: 'none', color: 'text.secondary' }}
          >
            Reply
          </Button>
        </Stack>

        {showReplyInput && (
          <Stack direction="row" spacing={2} sx={{ mt: 2, mb: 1 }}>
            <Avatar src={user?.avatar} sx={{ width: 24, height: 24 }} />
            <TextField
              fullWidth
              size="small"
              placeholder="Add a reply..."
              variant="standard"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              disabled={postingReply}
            />
            <Button 
              size="small" 
              variant="contained" 
              disabled={!replyText.trim() || postingReply} 
              onClick={handlePostReply}
            >
              Reply
            </Button>
          </Stack>
        )}

        {data.repliesCount > 0 && (
          <Button
            size="small"
            startIcon={showReplies ? <ExpandLess /> : <ExpandMore />}
            onClick={handleFetchReplies}
            sx={{ mt: 1, textTransform: 'none' }}
          >
            {showReplies ? 'Hide' : 'View'} {data.repliesCount} {data.repliesCount === 1 ? 'reply' : 'replies'}
          </Button>
        )}

        <Collapse in={showReplies}>
          <Box sx={{ pl: 2, mt: 2, borderLeft: '2px solid', borderColor: 'divider' }}>
            {loadingReplies ? (
              <Typography variant="caption" sx={{ display: 'block', py: 1 }}>Loading replies...</Typography>
            ) : (
              replies.map((reply) => (
                <CommentItem 
                  key={reply._id} 
                  comment={reply} 
                  onDelete={(id) => setReplies(prev => prev.filter(r => r._id !== id))}
                  videoId={videoId}
                />
              ))
            )}
          </Box>
        </Collapse>
      </Box>
    </Stack>
  );
};

export default CommentItem;
