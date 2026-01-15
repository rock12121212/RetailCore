import { useEffect, useState } from 'react';
import { Box, Grid, Paper, Stack, Typography } from '@mui/material';
import { OndemandVideoRounded, PlaylistPlayRounded, TextSnippetRounded } from '@mui/icons-material';
import { listVideos } from '../api/videos.js';
import { listTweets } from '../api/tweets.js';
import { listPlaylists } from '../api/playlists.js';
import SectionHeader from '../components/SectionHeader.jsx';
import StatCard from '../components/StatCard.jsx';

const Home = () => {
  const [stats, setStats] = useState({ videos: 0, tweets: 0, playlists: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const results = await Promise.allSettled([
        listVideos(),
        listTweets(),
        listPlaylists(),
      ]);

      const [videos, tweets, playlists] = results.map((result) =>
        result.status === 'fulfilled' ? result.value : []
      );

      setStats({
        videos: Array.isArray(videos) ? videos.length : videos?.length || 0,
        tweets: Array.isArray(tweets) ? tweets.length : tweets?.length || 0,
        playlists: Array.isArray(playlists) ? playlists.length : playlists?.length || 0,
      });
      setLoading(false);
    };

    load();
  }, []);

  return (
    <Stack spacing={4}>
      <SectionHeader
        title="Creator overview"
        subtitle="Track everything happening across your channel."
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Videos"
            value={loading ? '...' : stats.videos}
            icon={<OndemandVideoRounded />}
            gradient="linear-gradient(135deg, #ffffff 0%, #e0f2fe 100%)"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Tweets"
            value={loading ? '...' : stats.tweets}
            icon={<TextSnippetRounded />}
            gradient="linear-gradient(135deg, #ffffff 0%, #ede9fe 100%)"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Playlists"
            value={loading ? '...' : stats.playlists}
            icon={<PlaylistPlayRounded />}
            gradient="linear-gradient(135deg, #ffffff 0%, #dcfce7 100%)"
          />
        </Grid>
      </Grid>

      <Paper
        elevation={0}
        className="glow-card"
        sx={{
          p: 4,
          borderRadius: 3,
          background:
            'linear-gradient(135deg, rgba(31,111,235,0.08) 0%, rgba(111,66,193,0.08) 100%)',
          border: '1px solid rgba(31,111,235,0.12)',
        }}
      >
        <Stack spacing={1}>
          <Typography variant="h5" fontWeight={700}>
            Studio highlights
          </Typography>
          <Typography color="text.secondary">
            Your content hub is ready. Create new videos, share quick updates, and
            organize playlists in one workspace.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
            {['Upload a video', 'Schedule a tweet', 'Curate playlists'].map((text) => (
              <Box
                key={text}
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: 99,
                  bgcolor: 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(255,255,255,0.9)',
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {text}
              </Box>
            ))}
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default Home;
