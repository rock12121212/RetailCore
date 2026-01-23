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
    avatarFile: null,
    coverImageFile: null,
  });
  const [currentImages, setCurrentImages] = useState({
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
      avatarFile: null,
      coverImageFile: null,
    });
    setCurrentImages({
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
    const { name, value, files } = event.target;
    if (files) {
      setFormState((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormState((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      const formData = new FormData();
      Object.keys(formState).forEach((key) => {
        if (key === 'avatarFile') {
          if (formState[key]) formData.append('avatar', formState[key]);
        } else if (key === 'coverImageFile') {
          if (formState[key]) formData.append('coverImage', formState[key]);
        } else if (formState[key]) {
          formData.append(key, formState[key]);
        }
      });

      const data = await updateProfile(formData);
      updateUser(data);
      hydrate(data);
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
                    background: currentImages.coverImage
                      ? `url(${currentImages.coverImage}) center/cover no-repeat`
                      : 'linear-gradient(135deg, #1f6feb 0%, #6f42c1 100%)',
                  }}
                />
                <Avatar
                  src={currentImages.avatar}
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
                <Stack direction="row" spacing={2}>
                  <Button variant="outlined" component="label" fullWidth>
                    Upload New Avatar
                    <input
                      type="file"
                      name="avatarFile"
                      hidden
                      onChange={handleChange}
                      accept="image/*"
                    />
                  </Button>
                  <Button variant="outlined" component="label" fullWidth>
                    Upload New Cover
                    <input
                      type="file"
                      name="coverImageFile"
                      hidden
                      onChange={handleChange}
                      accept="image/*"
                    />
                  </Button>
                </Stack>
                {formState.avatarFile && (
                  <Typography variant="caption" color="text.secondary">
                    New Avatar: {formState.avatarFile.name}
                  </Typography>
                )}
                {formState.coverImageFile && (
                  <Typography variant="caption" color="text.secondary">
                    New Cover: {formState.coverImageFile.name}
                  </Typography>
                )}
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
