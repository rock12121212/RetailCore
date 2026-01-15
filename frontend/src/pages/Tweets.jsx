import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SectionHeader from '../components/SectionHeader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { createTweet, listTweets } from '../api/tweets.js';

const Tweets = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');

  const loadTweets = async () => {
    setLoading(true);
    try {
      const data = await listTweets();
      setTweets(Array.isArray(data) ? data : data?.tweets || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTweets();
  }, []);

  const handleSubmit = async () => {
    await createTweet({ content });
    setContent('');
    setOpen(false);
    await loadTweets();
  };

  return (
    <Stack spacing={3}>
      <SectionHeader
        title="Tweets"
        subtitle="Share quick updates with your community."
        actionLabel="New tweet"
        onAction={() => setOpen(true)}
      />

      {loading ? null : tweets.length ? (
        <Grid container spacing={3}>
          {tweets.map((tweet) => (
            <Grid item xs={12} md={6} key={tweet._id || tweet.id}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  boxShadow: '0 14px 28px rgba(15, 23, 42, 0.12)',
                  transition: 'transform 0.25s ease',
                  '&:hover': { transform: 'translateY(-6px)' },
                }}
              >
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="body1" fontWeight={600}>
                      {tweet.content || 'No content'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {tweet.createdAt ? new Date(tweet.createdAt).toLocaleString() : 'Just now'}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <EmptyState
          title="No tweets yet"
          subtitle="Share updates to keep your audience engaged."
        />
      )}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create a tweet</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <TextField
              label="What’s happening?"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              multiline
              minRows={4}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={!content.trim()}>
            Publish
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default Tweets;
