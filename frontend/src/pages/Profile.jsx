import { useEffect, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SectionHeader from '../components/SectionHeader.jsx';
import { getCurrentUser, updateProfile } from '../api/users.js';
import { useAuth } from '../hooks/useAuth.js';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formState, setFormState] = useState({
    username: '',
    email: '',
    fullName: '',
    avatar: '',
    coverImage: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const hydrate = (data) => {
    setFormState({
      username: data?.username || '',
      email: data?.email || '',
      fullName: data?.fullName || '',
      avatar: data?.avatar || '',
      coverImage: data?.coverImage || '',
    });
  };

  useEffect(() => {
    if (user) {
      hydrate(user);
    } else {
      getCurrentUser().then((data) => {
        if (data) hydrate(data);
      });
    }
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      const data = await updateProfile(formState);
      updateUser(data);
      setStatus({ type: 'success', message: 'Profile updated successfully.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error?.response?.data?.message || 'Failed to update profile.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <SectionHeader
        title="Profile"
        subtitle="Update your public profile and brand assets."
      />

      {status.message ? <Alert severity={status.type}>{status.message}</Alert> : null}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Stack spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: '100%',
                    height: 120,
                    borderRadius: 3,
                    background: formState.coverImage
                      ? `url(${formState.coverImage}) center/cover no-repeat`
                      : 'linear-gradient(135deg, #1f6feb 0%, #6f42c1 100%)',
                  }}
                />
                <Avatar
                  src={formState.avatar}
                  sx={{ width: 80, height: 80, mt: -6, border: '3px solid #fff' }}
                >
                  {formState.username?.[0]?.toUpperCase() || 'U'}
                </Avatar>
                <Box textAlign="center">
                  <Typography variant="h6" fontWeight={700}>
                    {formState.fullName || 'Your name'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    @{formState.username || 'username'}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack spacing={2}>
                <TextField
                  label="Full name"
                  name="fullName"
                  value={formState.fullName}
                  onChange={handleChange}
                />
                <TextField
                  label="Username"
                  name="username"
                  value={formState.username}
                  onChange={handleChange}
                />
                <TextField
                  label="Email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                />
                <TextField
                  label="Avatar URL"
                  name="avatar"
                  value={formState.avatar}
                  onChange={handleChange}
                />
                <TextField
                  label="Cover image URL"
                  name="coverImage"
                  value={formState.coverImage}
                  onChange={handleChange}
                />
                <Button variant="contained" onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Saving...' : 'Save changes'}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default Profile;
