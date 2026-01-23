import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  IconButton,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SectionHeader from '../components/SectionHeader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { createVideo, deleteVideo, listVideos } from '../api/videos.js';

const Videos = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    videoFile: null,
    thumbnail: null,
    isPublished: true,
  });
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, videoId: null });

  const loadVideos = async () => {
    setLoading(true);
    try {
      const data = await listVideos();
      setVideos(Array.isArray(data.items) ? data.items : data.items?.videos || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (files) {
      setFormState((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormState((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    Object.keys(formState).forEach((key) => {
      if (formState[key] !== null && formState[key] !== undefined) {
        formData.append(key, formState[key]);
      }
    });

    await createVideo(formData);
    setOpen(false);
    setFormState({
      title: '',
      description: '',
      videoFile: null,
      thumbnail: null,
      isPublished: true,
    });
    await loadVideos();
  };

  const handleDelete = async () => {
    if (!deleteConfirm.videoId) return;
    try {
      await deleteVideo(deleteConfirm.videoId);
      await loadVideos();
    } finally {
      setDeleteConfirm({ open: false, videoId: null });
    }
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
                cursor: 'pointer',
                boxShadow: '0 16px 30px rgba(15, 23, 42, 0.12)',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                position: 'relative',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 20px 40px rgba(15, 23, 42, 0.18)',
                  '& .delete-btn': { opacity: 1 },
                },
              }}
              onClick={() => navigate(`/videos/${video._id}`)}
            >
              <Tooltip title="Delete Video">
                <IconButton
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteConfirm({ open: true, videoId: video._id });
                  }}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'rgba(255,255,255,0.9)',
                    color: 'error.main',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    '&:hover': { bgcolor: '#fff' },
                  }}
                  size="small"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
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
            <Stack spacing={1}>
              <Button variant="outlined" component="label" fullWidth>
                Upload Video File
                <input
                  type="file"
                  name="videoFile"
                  hidden
                  onChange={handleChange}
                  accept="video/*"
                />
              </Button>
              {formState.videoFile && (
                <Typography variant="caption" color="text.secondary">
                  Video: {formState.videoFile.name}
                </Typography>
              )}
            </Stack>
            <Stack spacing={1}>
              <Button variant="outlined" component="label" fullWidth>
                Upload Thumbnail
                <input
                  type="file"
                  name="thumbnail"
                  hidden
                  onChange={handleChange}
                  accept="image/*"
                />
              </Button>
              {formState.thumbnail && (
                <Typography variant="caption" color="text.secondary">
                  Thumbnail: {formState.thumbnail.name}
                </Typography>
              )}
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, videoId: null })}
      >
        <DialogTitle>Delete Video?</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this video? This action cannot be undone and will remove
          the files from cloud storage.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm({ open: false, videoId: null })}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default Videos;
