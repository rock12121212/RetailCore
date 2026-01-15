import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
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
import { createVideo, listVideos } from '../api/videos.js';

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    videoFile: '',
    thumbnail: '',
    duration: '',
    isPublished: true,
  });

  const loadVideos = async () => {
    setLoading(true);
    try {
      const data = await listVideos();
      setVideos(Array.isArray(data) ? data : data?.videos || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    await createVideo({
      ...formState,
      duration: formState.duration ? Number(formState.duration) : undefined,
    });
    setOpen(false);
    setFormState({
      title: '',
      description: '',
      videoFile: '',
      thumbnail: '',
      duration: '',
      isPublished: true,
    });
    await loadVideos();
  };

  const content = useMemo(() => {
    if (loading) return null;
    if (!videos.length) {
      return (
        <EmptyState
          title="No videos yet"
          subtitle="Upload your first video to start building your library."
        />
      );
    }

    return (
      <Grid container spacing={3}>
        {videos.map((video) => (
          <Grid item xs={12} md={6} lg={4} key={video._id || video.id}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 3,
                boxShadow: '0 16px 30px rgba(15, 23, 42, 0.12)',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 20px 40px rgba(15, 23, 42, 0.18)',
                },
              }}
            >
              <Box
                sx={{
                  height: 180,
                  background: video.thumbnail
                    ? `url(${video.thumbnail}) center/cover no-repeat`
                    : 'linear-gradient(135deg, #1f6feb 0%, #6f42c1 100%)',
                }}
              />
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="h6" fontWeight={700}>
                    {video.title || 'Untitled video'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {video.description || 'No description provided.'}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Chip
                      size="small"
                      label={video.isPublished ? 'Published' : 'Draft'}
                      color={video.isPublished ? 'success' : 'default'}
                    />
                    {video.duration ? (
                      <Chip size="small" label={`${video.duration} sec`} />
                    ) : null}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }, [loading, videos]);

  return (
    <Stack spacing={3}>
      <SectionHeader
        title="Videos"
        subtitle="Manage your uploads and publication status."
        actionLabel="New video"
        onAction={() => setOpen(true)}
      />

      {content}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create new video</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Title" name="title" value={formState.title} onChange={handleChange} />
            <TextField
              label="Description"
              name="description"
              value={formState.description}
              onChange={handleChange}
              multiline
              minRows={3}
            />
            <TextField
              label="Video URL"
              name="videoFile"
              value={formState.videoFile}
              onChange={handleChange}
            />
            <TextField
              label="Thumbnail URL"
              name="thumbnail"
              value={formState.thumbnail}
              onChange={handleChange}
            />
            <TextField
              label="Duration (seconds)"
              name="duration"
              type="number"
              value={formState.duration}
              onChange={handleChange}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default Videos;
