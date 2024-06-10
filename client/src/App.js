import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import CreatePage from './pages/CreatePage';
import MyImagesPage from './pages/MyImagesPage';
import UploadPage from './pages/UploadPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Sidebar from './components/Sidebar';
import url from './components/Url'; 

const theme = createTheme({
  palette: {
    primary: {
      main: '#263238',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    setLoading(false);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('isLoggedIn', 'false');
  };

  if (loading) {
    return null; // or a loading spinner, if you prefer
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div style={{ display: 'flex' }}>
          {isLoggedIn && <Sidebar onLogout={handleLogout} />}
          <div style={{ flex: 1, padding: isLoggedIn ? '20px' : '0' }}>
            <Routes>
              <Route
                path="/"
                element={isLoggedIn ? <Navigate to="/upload" /> : <Navigate to="/login" />}
              />
              <Route
                path="/create"
                element={isLoggedIn ? <CreatePage /> : <Navigate to="/login" />}
              />
              <Route
                path="/my-images"
                element={isLoggedIn ? <MyImagesPage /> : <Navigate to="/login" />}
              />
              <Route
                path="/upload"
                element={isLoggedIn ? <UploadPage /> : <Navigate to="/login" />}
              />
              <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
              <Route path="/signup" element={<SignupPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
