import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  TextField,
  MenuItem,
  Button,
  Stack,
  Typography,
  Box,
} from '@mui/material';
import axios from 'axios'

const NewTask = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  // console.log(useParams())
  const { id } = useParams();
  const projectName= useLocation().state.projectName
  console.log(id)
  useEffect(()=>{
    if(!token){
      navigate('/login')
      return
    }

  })
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: '',
    createdAt: '',
    completedAt: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const index = Number(id);
    // const projects = JSON.parse(localStorage.getItem('projects')) || [];
    // const project = projects[index];
    // project.tasks = project.tasks || [];
    // project.tasks.push(formData);
    console.log(formData)
    
    axios.post(`http://localhost:8080/add-task/${id}`,formData,{
      headers: {
        "Authorization" : "Bearer "+ token,
        "Content-Type": "application/json"
      }
    })
    .then(response =>{
      console.log(response.data)
      const {taskId, projectId} = response.data;
      console.log(projectId)
      setFormData({
      title: '',
      description: '',
      status: '',
      createdAt: '',
      completedAt: '',
      })
      // projects[index] = project;
      // localStorage.setItem('projects', JSON.stringify(projects));
      navigate(`/view-tasks/${projectId}`,{state: {
        projectId: response.data.projectId,
        projectName: response.data.projectName
      }});
    })
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Add New Task to Project - {projectName}
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
            Submit Task
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default NewTask;
