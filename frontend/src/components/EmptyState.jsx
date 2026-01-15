import { Box, Typography } from '@mui/material';

const EmptyState = ({ title, subtitle }) => (
  <Box
    sx={{
      p: 4,
      textAlign: 'center',
      borderRadius: 3,
      border: '1px dashed rgba(31, 111, 235, 0.3)',
      backgroundColor: 'rgba(31, 111, 235, 0.03)',
    }}
  >
    <Typography variant="h6" fontWeight={600}>
      {title}
    </Typography>
    {subtitle ? (
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        {subtitle}
      </Typography>
    ) : null}
  </Box>
);

export default EmptyState;
