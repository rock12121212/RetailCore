import { useMemo, useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  Button,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  HomeRounded,
  MenuRounded,
  OndemandVideoRounded,
  PersonRounded,
  PlaylistPlayRounded,
  SubscriptionsRounded,
  TextSnippetRounded,
} from '@mui/icons-material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const drawerWidth = 260;

const AppShell = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = useMemo(() => ([
    { label: 'Overview', icon: <HomeRounded />, path: '/' },
    { label: 'Videos', icon: <OndemandVideoRounded />, path: '/videos' },
    { label: 'Tweets', icon: <TextSnippetRounded />, path: '/tweets' },
    { label: 'Playlists', icon: <PlaylistPlayRounded />, path: '/playlists' },
    { label: 'Subscriptions', icon: <SubscriptionsRounded />, path: '/subscriptions' },
    { label: 'Profile', icon: <PersonRounded />, path: '/profile' },
  ]), []);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const drawerContent = (
    <Stack sx={{ height: '100%' }}>
      <Stack spacing={0.5} sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={800}>
          RetailCore Studio
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Creator command center
        </Typography>
      </Stack>
      <Divider />
      <List sx={{ px: 2, py: 2 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => {
              navigate(item.path);
              setMobileOpen(false);
            }}
            sx={{
              mb: 1,
              borderRadius: 2,
              '&.Mui-selected': {
                backgroundColor: 'rgba(31, 111, 235, 0.12)',
                color: 'primary.main',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ px: 3, pb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar>{user?.username?.[0]?.toUpperCase() || 'U'}</Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight={600}>
              {user?.username || 'User'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email || 'Signed in'}
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
          color: 'text.primary',
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          {!isDesktop && (
            <IconButton onClick={handleDrawerToggle}>
              <MenuRounded />
            </IconButton>
          )}
          <Typography variant="h6" fontWeight={700}>
            {navItems.find((item) => item.path === location.pathname)?.label || 'Overview'}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              variant="outlined"
              size="small"
              onClick={logout}
              disabled={loading}
              sx={{ textTransform: 'none' }}
            >
              {loading ? 'Signing out...' : 'Logout'}
            </Button>
            <Avatar sx={{ width: 32, height: 32 }}>
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </Avatar>
            {isDesktop ? (
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  {user?.username || 'User'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email || 'Signed in'}
                </Typography>
              </Box>
            ) : null}
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isDesktop ? 'permanent' : 'temporary'}
        open={isDesktop ? true : mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            borderRight: '1px solid rgba(15, 23, 42, 0.08)',
            bgcolor: '#ffffff',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: { xs: 2, md: 4 },
          pt: { xs: 10, md: 12 },
          pb: 6,
          ml: isDesktop ? `${drawerWidth}px` : 0,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AppShell;
