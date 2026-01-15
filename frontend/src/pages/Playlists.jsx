import { useEffect, useState } from 'react';
import {
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
import { createPlaylist, listPlaylists } from '../api/playlists.js';

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formState, setFormState] = useState({ name: '', description: '' });

  const loadPlaylists = async () => {
    setLoading(true);
    try {
      const data = await listPlaylists();
      setPlaylists(Array.isArray(data) ? data : data?.playlists || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlaylists();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    await createPlaylist(formState);
    setOpen(false);
    setFormState({ name: '', description: '' });
    await loadPlaylists();
  };

  return (
    <Stack spacing={3}>
      <SectionHeader
        title="Playlists"
        subtitle="Group videos into curated collections."
        actionLabel="New playlist"
        onAction={() => setOpen(true)}
      />

      {loading ? null : playlists.length ? (
        <Grid container spacing={3}>
          {playlists.map((playlist) => (
            <Grid item xs={12} md={6} lg={4} key={playlist._id || playlist.id}>
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
                  <Stack spacing={1}>
                    <Typography variant="h6" fontWeight={700}>
                      {playlist.name || 'Untitled playlist'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {playlist.description || 'No description yet.'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {Array.isArray(playlist.videos)
                        ? `${playlist.videos.length} videos`
                        : 'No videos added'}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <EmptyState
          title="No playlists yet"
          subtitle="Create a playlist to organize content."
        />
      )}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create a playlist</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Playlist name"
              name="name"
              value={formState.name}
              onChange={handleChange}
            />
            <TextField
              label="Description"
              name="description"
              value={formState.description}
              onChange={handleChange}
              multiline
              minRows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={!formState.name.trim()}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default Playlists;
