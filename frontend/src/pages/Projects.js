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

  // Fetch projects on component mount
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProjects = async () => {
      try {
        const res = await axios.get('http://localhost:8080/projects', {
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
        // Update project
        const projectToUpdate = projects[editingIndex];
        const updatedProject = {
          ...formData,
          tasks: projectToUpdate.tasks || [],
          p_id: projectToUpdate._id,
        };

        await axios.put('http://localhost:8080/update-project', updatedProject, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        });

        const updatedProjects = [...projects];
        updatedProjects[editingIndex] = { ...updatedProject, _id: projectToUpdate._id };
        setProjects(updatedProjects);
      } else if (projects.length < 4) {
        // Add new project
        const res = await axios.post('http://localhost:8080/add-project', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        });

        const newProject = res.data.project;
        setProjects(prev => [...prev, newProject]);
      }

      setFormData({ name: '', description: '' });
      handleClose();
    } catch (err) {
      console.error("Error during project submit:", err);
    }
  };

  const handleDelete = async (index) => {
    const projectId = projects[index]?._id;
    if (!projectId) return;

    try {
      await axios.delete(`http://localhost:8080/delete-project/${projectId}`, {
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
    setFormData({
      name: projects[index].name,
      description: projects[index].description
    });
    setEditingIndex(index);
    setShowModal(true);
  };

  const handleAddTask = (projectId) => {
    const project = projects.find(p => p._id === projectId);
    console.log(project)
    navigate(`/add-task/${projectId}`,{
      state: {
        projectName: project.name
      }
    });
  };

  const handleViewTasks = (projectId) => {
    const project = projects.find(p => p._id === projectId);
    console.log(project)
    console.log(project._id)
    if (!project) {
      console.error("Project not found");
      return;
    }

    navigate(`/view-tasks/${projectId}`, {
      state: {
        projectId: project._id,
        projectName: project.name
      }
    });
  };

  const actionBar = (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
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
        <Typography variant="h4">Projects</Typography>
        <Button
          variant="contained"
          onClick={handleClick}
          disabled={projects.length >= 4 && editingIndex === null}
        >
          Add a Project
        </Button>
      </Box>

      {projects.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ mt: 5 }}>
          No Projects Added
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {projects.map((project, index) => (
            <Grid item xs={12} sm={6} md={4} key={project._id}>
              <ProjectItem
                name={project.name}
                description={project.description}
                onDelete={() => handleDelete(index)}
                onModify={() => handleModify(index)}
                onAddTask={() => handleAddTask(project._id)}
                onView={() => handleViewTasks(project._id)}
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
