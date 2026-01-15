import { Box, Button, Stack, Typography } from '@mui/material';

const SectionHeader = ({ title, subtitle, actionLabel, onAction }) => (
  <Stack
    direction={{ xs: 'column', sm: 'row' }}
    spacing={2}
    alignItems={{ xs: 'flex-start', sm: 'center' }}
    justifyContent="space-between"
  >
    <Box>
      <Typography variant="h5" fontWeight={700}>
        {title}
      </Typography>
      {subtitle ? (
        <Typography color="text.secondary" variant="body2">
          {subtitle}
        </Typography>
      ) : null}
    </Box>
    {actionLabel ? (
      <Button variant="contained" onClick={onAction}>
        {actionLabel}
      </Button>
    ) : null}
  </Stack>
);

export default SectionHeader;
