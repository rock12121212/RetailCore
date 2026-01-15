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
import { createSubscription, listSubscriptions } from '../api/subscriptions.js';

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [channelId, setChannelId] = useState('');

  const loadSubscriptions = async () => {
    setLoading(true);
    try {
      const data = await listSubscriptions();
      setSubscriptions(Array.isArray(data) ? data : data?.subscriptions || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const handleSubmit = async () => {
    await createSubscription({ channelId });
    setChannelId('');
    setOpen(false);
    await loadSubscriptions();
  };

  return (
    <Stack spacing={3}>
      <SectionHeader
        title="Subscriptions"
        subtitle="Manage channels you follow."
        actionLabel="Subscribe"
        onAction={() => setOpen(true)}
      />

      {loading ? null : subscriptions.length ? (
        <Grid container spacing={3}>
          {subscriptions.map((sub) => (
            <Grid item xs={12} md={6} lg={4} key={sub._id || sub.id}>
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
                      {sub.channel?.username || sub.channelId || 'Channel'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {sub.channel?.email || 'Subscribed channel'}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <EmptyState
          title="No subscriptions yet"
          subtitle="Subscribe to channels to stay updated."
        />
      )}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Subscribe to a channel</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Channel ID"
              value={channelId}
              onChange={(event) => setChannelId(event.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={!channelId.trim()}>
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default Subscriptions;
