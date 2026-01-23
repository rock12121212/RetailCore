import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { register as registerApi } from '../api/auth.js';

const Register = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    avatar: null,
    coverImage: null,
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (files) {
      setFormState((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormState((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(formState).forEach((key) => {
        if (formState[key]) {
          formData.append(key, formState[key]);
        }
      });

      await registerApi(formData);
      navigate('/login', {
        replace: true,
        state: { success: 'Account created. Please sign in.' },
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error?.response?.data?.message || 'Registration failed',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100svh',
        background:
          'radial-gradient(circle at 80% 20%, rgba(31,111,235,0.16), transparent 45%), radial-gradient(circle at 20% 10%, rgba(111,66,193,0.16), transparent 35%), #f5f7fb',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth="sm" sx={{ py: 0 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            border: '1px solid rgba(31,111,235,0.15)',
            boxShadow: '0 30px 60px rgba(15,23,42,0.12)',
          }}
        >
          <Stack spacing={3}>
            <Box>
              <Typography variant="overline" color="primary" fontWeight={700}>
                RetailCore Studio
              </Typography>
              <Typography variant="h4" fontWeight={700}>
                Create your account
              </Typography>
              <Typography color="text.secondary">
                Join the creator hub and manage your content.
              </Typography>
            </Box>

            {status.message ? <Alert severity={status.type}>{status.message}</Alert> : null}

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  label="Username"
                  name="username"
                  value={formState.username}
                  onChange={handleChange}
                  required
                  fullWidth
                />
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                  fullWidth
                />
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={formState.password}
                  onChange={handleChange}
                  required
                  fullWidth
                />
                <TextField
                  label="Full Name"
                  name="fullName"
                  value={formState.fullName}
                  onChange={handleChange}
                  fullWidth
                />
                <Stack direction="row" spacing={2}>
                  <Button variant="outlined" component="label" fullWidth>
                    Upload Avatar
                    <input type="file" name="avatar" hidden onChange={handleChange} accept="image/*" />
                  </Button>
                  <Button variant="outlined" component="label" fullWidth>
                    Upload Cover
                    <input
                      type="file"
                      name="coverImage"
                      hidden
                      onChange={handleChange}
                      accept="image/*"
                    />
                  </Button>
                </Stack>
                {formState.avatar && (
                  <Typography variant="caption" color="text.secondary">
                    Avatar: {formState.avatar.name}
                  </Typography>
                )}
                {formState.coverImage && (
                  <Typography variant="caption" color="text.secondary">
                    Cover: {formState.coverImage.name}
                  </Typography>
                )}
                <Button type="submit" variant="contained" size="large" disabled={loading}>
                  {loading ? 'Creating account...' : 'Create account'}
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
