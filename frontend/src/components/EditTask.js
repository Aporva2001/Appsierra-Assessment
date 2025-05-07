import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  TextField,
  MenuItem,
  Button,
  Stack,
  Typography,
  Box,
} from '@mui/material';
import axios from 'axios';

const EditTask = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const taskData = state.taskData;

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const [formData, setFormData] = useState({
    title: taskData.title,
    description: taskData.description,
    status: taskData.status,
    createdAt: taskData.createdAt,
    completedAt: taskData.completedAt,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
      // console.log(formData);
      axios.put(`${process.env.REACT_APP_API_URI}/edit-task/${id}`,formData,{
        headers:{
            "Authorization": "Bearer "+token,
            "Content-Type": "application/json"
        }
      })
      .then(response =>{
        // console.log(response.data)
        navigate('/projects'); 
      })
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Update Task - {taskData.title}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
            required
          />
          <TextField
            select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            fullWidth
            required
          >
            <MenuItem value="Not Started">Not Started</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </TextField>
          <TextField
            label="Date of Creation"
            name="createdAt"
            type="date"
            value={formData.createdAt}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
          />
          <TextField
            label="Date of Completion"
            name="completedAt"
            type="date"
            value={formData.completedAt}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <Button variant="contained" color="primary" type="submit">
            Update Task
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default EditTask;
