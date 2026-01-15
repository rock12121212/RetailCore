import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Home from './pages/Home.jsx';
import Videos from './pages/Videos.jsx';
import Tweets from './pages/Tweets.jsx';
import Playlists from './pages/Playlists.jsx';
import Subscriptions from './pages/Subscriptions.jsx';
import Profile from './pages/Profile.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import AppShell from './layout/AppShell.jsx';
import { useAuth } from './hooks/useAuth.js';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Register />}
      />
      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="videos" element={<Videos />} />
        <Route path="tweets" element={<Tweets />} />
        <Route path="playlists" element={<Playlists />} />
        <Route path="subscriptions" element={<Subscriptions />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
