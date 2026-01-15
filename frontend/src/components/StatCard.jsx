import { Box, Paper, Stack, Typography } from '@mui/material';

const StatCard = ({ title, value, icon, gradient }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      borderRadius: 3,
      background: gradient || 'linear-gradient(135deg, #ffffff 0%, #eef2ff 100%)',
      boxShadow: '0 18px 30px rgba(31, 111, 235, 0.08)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      '&:hover': {
        transform: 'translateY(-6px)',
        boxShadow: '0 24px 48px rgba(31, 111, 235, 0.18)',
      },
    }}
  >
    <Stack direction="row" spacing={2} alignItems="center">
      <Box
        sx={{
          width: 52,
          height: 52,
          borderRadius: '16px',
          display: 'grid',
          placeItems: 'center',
          background: 'rgba(31, 111, 235, 0.12)',
          color: 'primary.main',
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h4" fontWeight={700}>
          {value}
        </Typography>
      </Box>
    </Stack>
  </Paper>
);

export default StatCard;
