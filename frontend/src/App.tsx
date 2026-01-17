import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import UserReport from './pages/UserReport';
import AdminDashboard from './pages/AdminDashboard';
import IncidentMap from './pages/IncidentMap';
import CommunityAlerts from './pages/CommunityAlerts';
import Settings from './pages/Settings';
import HelpCenter from './pages/HelpCenter';
import MyReports from './pages/MyReports';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { Toaster } from 'sonner';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-center" richColors />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<UserReport />} />
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="map" element={<IncidentMap />} />
              <Route path="my-reports" element={<MyReports />} />
              <Route path="alerts" element={<CommunityAlerts />} />
              <Route path="settings" element={<Settings />} />
              <Route path="help" element={<HelpCenter />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
