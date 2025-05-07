import React, { useEffect, useState } from 'react';
import {
  Box, Grid, Stack, TextField, Typography, Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import NewProject from '../components/NewProject';
import ProjectItem from '../components/ProjectItem';

const Projects = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  // const [countCompletedProjects, setCountCompletedProjects] = useState(0)

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URI}/projects`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        });
        setProjects(res.data.projects || []);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };
    fetchProjects();
  }, [navigate, token]);

  const handleClick = () => {
    setFormData({ name: '', description: '' });
    setEditingIndex(null);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingIndex(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      if (editingIndex !== null) {

        const projectToUpdate = projects[editingIndex];
        const updatedProject = {
          ...formData,
          tasks: projectToUpdate.tasks || [],
          _id: projectToUpdate.projectId, 
        };
        // console.log(updatedProject)

        const response = await axios.put(`${process.env.REACT_APP_API_URI}/update-project`, updatedProject, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        });
        // console.log(response.data.project)
        
        if (response.status === 200 && response.data?.project) {
          const updatedProjects = [...projects];
          updatedProjects[editingIndex] = response.data.project;
          // console.log(updatedProjects)
          setProjects(updatedProjects);
        } else {
          console.error("Unexpected update response:", response.data.project);
        }
  
      } else if (projects.length < 4) {
        // Add new project
        // console.log(formData)
        const res = await axios.post(`${process.env.REACT_APP_API_URI}/add-project`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        });
        // console.log(res.data.project)
        const newProject = {
          projectId: res.data.project._id,
          projectName: res.data.project.name,
          description: res.data.project.description,
          totalTasks: 0,
          inProgressTasks:0,
          notStartedTasks:0,
          completedTasks:0
        }
        // console.log(projects)
        if (res.status === 201 && res.data?.project) {
          setProjects(prev => [...prev, newProject]);
        } else {
          console.error("Unexpected add response:", res.data);
        }
      }
  
      setFormData({ name: '', description: '' });
      handleClose();
  
    } catch (err) {
      console.error("Error during project submit:", err.response?.data || err.message);
    }
  };
  
  

  const handleDelete = async (index) => {
    const projectId = projects[index]?.projectId;
    if (!projectId) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URI}/delete-project/${projectId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      setProjects(projects.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  const handleModify = (index) => {
    // console.log(projects[index])
    setFormData({
      name: projects[index].projectName,
      description: projects[index].description
    });
    setEditingIndex(index);
    setShowModal(true);
  };

  const handleAddTask = (projectId) => {
    const project = projects.find(p => p.projectId === projectId);
    // console.log(project)
    navigate(`/add-task/${projectId}`,{
      state: {
        projectName: project.projectName
      }
    });
  };

  const handleViewTasks = (projectId) => {
    const project = projects.find(p => p.projectId === projectId);
    // console.log(project)
    // console.log(project._id)
    if (!project) {
      console.error("Project not found");
      return;
    }

    navigate(`/view-tasks/${projectId}`, {
      state: {
        projectId: project.projectId,
        projectName: project.projectName,
        description: project.description
      }
    });
  };

  const actionBar = (
    <Box sx={{ display:'flex', justifyContent: 'flex-end', mt: 3 }}>
      <Button variant="contained" color="success" type="submit">
        {editingIndex !== null ? 'Update' : 'Add'}
      </Button>
    </Box>
  );

  const modal = (
    <NewProject onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            label="Project Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Project Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
            required
          />
          {actionBar}
        </Stack>
      </form>
    </NewProject>
  );

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>Projects</Typography>
        <Button
  variant="contained"
  onClick={handleClick}
  disabled={projects.length >= 10 && editingIndex === null}
  sx={{
    mt: 2,
    backgroundColor: '#1976d2',
    '&:hover': {
      backgroundColor: '#115293',
    },
    textTransform: 'none',
    fontWeight: 'bold',
    px: 3,
    py: 1,
    fontSize: '1rem',
    borderRadius: 2,
  }}
>
  ➕ Create New Project
</Button>
      </Box>
{/* {console.log(projects)} */}
      {projects.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ mt: 5 }}>
          No Projects Added
        </Typography>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {projects.map((project, index) => (
            <Grid item xs={12} sm={6} md={4} key={project.projectId}>
              <ProjectItem
              key={project.projectId}
                name={project.projectName}
                description={project.description}
                onDelete={() => handleDelete(index)}
                onModify={() => handleModify(index)}
                onAddTask={() => handleAddTask(project.projectId)}
                onView={() => handleViewTasks(project.projectId)}
                completedTasks= {project.completedTasks}
                inProgressTasks= {project.inProgressTasks}
                notStartedTasks= {project.notStartedTasks}
                totalTasks= {project.totalTasks}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {showModal && modal}
    </Box>
  );
};

export default Projects;
