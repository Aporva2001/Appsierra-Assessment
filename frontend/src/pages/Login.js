import React, { useState } from 'react';
import axios from 'axios'

import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Paper,
  Alert
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const LoginForm = () => {

  const navigate= useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [existingUserAlert, setExistingUserAlert] = useState(false)
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login submitted:', formData);
    axios.post('http://localhost:8080/login',formData)
    .then(response =>{
        const existedUser = response.data.existingUser;
        console.log(existedUser)
        if (!existedUser) {
            setExistingUserAlert(true);  
          } else {
            console.log(response.data)
            localStorage.setItem("userId",response.data.userId);
            localStorage.setItem("token", response.data.token);
            
            navigate("/projects");       
          }
    })
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 6 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>
        {existingUserAlert && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    User does not exist. Signup instead
                  </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            fullWidth
            margin="normal"
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Login
          </Button>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
  Don't have an account?{' '}
  <Link to="/" style={{ textDecoration: 'none', color: '#1976d2' }}>
    Sign Up
  </Link>
</Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginForm;
