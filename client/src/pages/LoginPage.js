import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Avatar, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/logo.png';
import url from '../components/Url';

const LoginPage = ({ onLogin }) => {
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!Email || !Password) {
      setError('All fields are required');
      return;
    }

    setLoading(true);

    try {
      // Replace with your API endpoint
      const response = await axios.post(`/api/v1/auth/login`, { Email, Password });
      setLoading(false);
      if (response.data.success) {
        localStorage.setItem('userID', response.data.user._id);
        onLogin();
        navigate('/upload');
      } else {
        setError('Login failed');
      }
    } catch (error) {
      setLoading(false);
      console.error('Error logging in', error);
      setError('Login failed');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <img src={logo} alt="Logo" width="40" height="40" />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
        </Box>
        <Button onClick={() => navigate('/signup')}>Don't have an account? Sign Up</Button>
      </Box>
    </Container>
  );
};

export default LoginPage;
