import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OAuthCallback from './pages/OAuthCallback';
import Intake from './pages/Intake';
import Dashboard from './pages/Dashboard';
import MyPlan from './pages/MyPlan';
import LogSession from './pages/LogSession';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { token } = useAuth();
    // Toggle this flag for UI testing
  const previewMode = false;

  if (previewMode) {
    return children; // always show the page
  }
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/oauth-callback" element={<OAuthCallback />} />
            <Route path="/intake" element={<ProtectedRoute><Intake /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/plan" element={<ProtectedRoute><MyPlan /></ProtectedRoute>} />
            <Route path="/log" element={<ProtectedRoute><LogSession /></ProtectedRoute>} />
            <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
