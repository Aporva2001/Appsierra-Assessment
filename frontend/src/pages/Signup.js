import React, { useState } from 'react';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  Container,
  Paper,
  Alert
} from '@mui/material';
import { Link } from 'react-router-dom';


countries.registerLocale(enLocale);

const countryList = Object.entries(countries.getNames('en', { select: 'official' })).map(
  ([code, name]) => ({ code, name })
);

const SignupForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    country: '',
  });

  const [userExistsAlert, setUserExistsAlert] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log('Form submitted:', formData);

    axios.post('http://localhost:8080', formData)
      .then(response => {
        const existedUser = response.data.existedUser;

        setFormData({
          name: '',
          email: '',
          password: '',
          country: '',
        });

        if (existedUser) {
          setUserExistsAlert(true);  
        } else {
          navigate("/login");       
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 6 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Welcome
        </Typography>

        {userExistsAlert && (
          <Alert severity="error" sx={{ mb: 2 }}>
            User already exists. Please log in instead.
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
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
          <TextField
            select
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          >
            {countryList.map(({ code, name }) => (
              <MenuItem key={code} value={name}>
                {name}
              </MenuItem>
            ))}
          </TextField>

          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Sign Up
          </Button>

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>
              Login
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignupForm;
